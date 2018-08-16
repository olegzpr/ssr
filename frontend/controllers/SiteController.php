<?php

namespace frontend\controllers;

use backend\models\GeoArea;
use backend\models\GeoCity;
use backend\models\GeoRegion;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\News;
use backend\models\Pages;
use backend\models\Rows;
use backend\models\SaveFilters;
use common\models\Regions;
use common\models\User;
use frontend\models\Favorites;
use frontend\models\Messages;
use frontend\models\Parser;
use frontend\models\Proxy;
use frontend\models\Sms;
use Mobizon\MobizonApi;
use Yii;
use yii\base\InvalidParamException;
use yii\db\Expression;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use lavrentiev\widgets\toastr\Notification;
use yii\web\Response;
use yii\widgets\ActiveForm;
use GuzzleHttp\Client;

/**
 * Site controller
 */
class SiteController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout', 'signup'],
                'rules' => [
                    [
                        'actions' => ['signup'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        $sale_items = Items::find()->where(['show_index'=>1])->orderBy('id')->limit(4)->all();
        $sale_items2 = Items::find()->where(['show_index'=>1])->orderBy('id')->limit(4)->offset(4)->all();
        $news = News::find()->where(['status' => 1])->orderBy('data desc')->limit(4)->all();
        return $this->render('index', [
            'sale_items' => $sale_items,
            'sale_items2' => $sale_items2,
            'news' => $news
        ]);
    }

    /**
     * Logs in a user.
     *
     * @return mixed
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        $model->load(Yii::$app->request->post());
        if ($model->login()) {
            return $this->redirect('/my');
        } else {
            Yii::$app->response->format = Response::FORMAT_JSON;
            return ActiveForm::validate($model);
        }
    }

    /**
     * Logs out the current user.
     *
     * @return mixed
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return mixed
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            if ($model->sendEmail(Yii::$app->params['adminEmail'])) {
                Yii::$app->session->setFlash('success', 'Thank you for contacting us. We will respond to you as soon as possible.');
            } else {
                Yii::$app->session->setFlash('error', 'There was an error sending your message.');
            }

            return $this->refresh();
        } else {
            return $this->render('contact', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Displays about page.
     *
     * @return mixed
     */
    public function actionAbout()
    {
        return $this->render('page');
    }

    /**
     * Signs user up.
     *
     * @return mixed
     */
    public function actionRegister()
    {
        if ($_POST['SignupForm']['code']!=''){
            $model = User::findOne(['username'=>$_POST['SignupForm']['username']]);
            if ($model['code'] == Yii::$app->request->post('SignupForm')['code']){
                $model->status = 13;
                $code = Sms::code();
                $model->setPassword($code);
                $model->generateAuthKey();
                $model->save();
                $api = new MobizonApi('91f8cd3cd111673fd8c80b6276baac2fe527f179');
                $api->call('message',
                    'sendSMSMessage',
                    array(
                        'recipient' => Yii::$app->request->post('SignupForm')['username'],
                        'text' => 'Ваш пароль - ' . $code
                    ));

                $login = new LoginForm();
                $login->username = Yii::$app->request->post('SignupForm')['username'];
                $login->password = $code;
                if ($login->login()) {
                    return $this->redirect('/my');
                } else {
                    Yii::$app->response->format = Response::FORMAT_JSON;
                    return ActiveForm::validate($model);
                }
            }
        } else {
            $model = new SignupForm();
            $model->load(Yii::$app->request->post());
            $code = Sms::code();
            $model->code = $code;
            if ($model->signup()) {
                $api = new MobizonApi('91f8cd3cd111673fd8c80b6276baac2fe527f179');
                $api->call('message',
                    'sendSMSMessage',
                    array(
                        'recipient' => Yii::$app->request->post('SignupForm')['username'],
                        'text' => 'Ваш код активации - ' . $code
                    ));
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ['success' => ['Код отправлен']];
            } else {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ActiveForm::validate($model);
            }
        }
    }

    public function actionSendCode()
    {
        $model = new SignupForm();
        $model->username = Yii::$app->request->post('SignupForm')['username'];
        $code = Sms::code();
        $model->code = $code;
        if ($user = $model->signup()) {
            $api = new MobizonApi('91f8cd3cd111673fd8c80b6276baac2fe527f179');
            $api->call('message',
                'sendSMSMessage',
                array(
                    'recipient' => Yii::$app->request->post('SignupForm')['username'],
                    'text' => 'Ваш код активации - ' . $code
                ));
        } else {
            Yii::$app->response->format = Response::FORMAT_JSON;
            return ActiveForm::validate($model);
        }
    }

    /**
     * Requests password reset.
     *
     * @return mixed
     */
    public
    function actionRequestPasswordReset()
    {
        $model = new PasswordResetRequestForm();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            if ($model->sendEmail()) {
                Yii::$app->session->setFlash('success', 'Check your email for further instructions.');

                return $this->goHome();
            } else {
                Yii::$app->session->setFlash('error', 'Sorry, we are unable to reset password for the provided email address.');
            }
        }

        return $this->render('requestPasswordResetToken', [
            'model' => $model,
        ]);
    }

    /**
     * Resets password.
     *
     * @param string $token
     * @return mixed
     * @throws BadRequestHttpException
     */
    public
    function actionResetPassword($token)
    {
        try {
            $model = new ResetPasswordForm($token);
        } catch (InvalidParamException $e) {
            throw new BadRequestHttpException($e->getMessage());
        }

        if ($model->load(Yii::$app->request->post()) && $model->validate() && $model->resetPassword()) {
            Yii::$app->session->setFlash('success', 'New password saved.');

            return $this->goHome();
        }

        return $this->render('resetPassword', [
            'model' => $model,
        ]);
    }

    public
    function actionVarification()
    {
        $code = $_POST['code'];
        $id = $_POST['id'];
        $res = Sms::find()->where(['code' => $code, 'user_id' => $id, 'status' => 0])->one();
        if (!empty($res)) {
            $res->status = 1;
            $res->save();
            $user = User::findOne($id);
            $user->status = 13;
            $user->save();
            return $this->render('varification');
        }
    }

    public
    function actionAddToFavorite()
    {
        if (!Yii::$app->session->isActive) {
            Yii::$app->session->open();
        }
        if (Yii::$app->user->isGuest) {
            return json_encode(['type' => 'error', 'text' => 'Войдите или зарегистрируйтесь']);
        }

        $user = Yii::$app->user->identity->id;

        $res = Favorites::find()->where(['item_id' => Yii::$app->request->post('id'), 'user_id' => $user])->one();
        if (empty($res)) {
            $new = new Favorites();
            $new->item_id = Yii::$app->request->post('id');
            $new->user_id = $user;
            $new->save();

            $exits = \backend\models\ItemStatics::findOne(['item_id' => Yii::$app->request->post('id'), 'type' => 'favorite', 'session' => Yii::$app->session->getId()]);
            if (empty($exits)) {
                $static = new \backend\models\ItemStatics();
                $static->item_id = Yii::$app->request->post('id');
                $static->type = 'favorite';
                $static->session = Yii::$app->session->getId();
                if (!$static->save()) {
                    print_r($static->getErrors());
                }
                return 'Ok';
            }

            return json_encode(['type' => 'success', 'text' => 'Добавлено в избранное', 'action'=>'add']);
        } else {
            $res->delete();
            return json_encode(['type' => 'info', 'text' => 'Удалено из избранного', 'action'=>'delete']);
        }
    }

    public
    function actionPage($pref)
    {
        $page = Pages::find()->where(['pref' => $pref])->one();
        if (empty($page)) {
            return $this->render('error', ['name' => '404 - Страница не найдена', 'message' => 'К сожелению, запрашиваемой страницы не существует']);
        } else {
            return $this->render('page', [
                'title' => $page['name'],
                'text' => $page['text'],
                'pref' => $page['pref']
            ]);
        }
    }

    public
    function actionNews($pref)
    {
        $tmp = explode('-', $pref);
        $id = array_pop($tmp);
        $news = News::findOne($id);
        if (empty($news)) {
            return $this->render('error', ['name' => '404 - Новость не найдена', 'message' => 'К сожелению, запрашиваемой новость не существует']);
        } else {
            return $this->render('page', [
                'title' => $news['title'],
                'text' => $news['text']
            ]);
        }
    }

    public
    function actionSendSms()
    {
        $sms = new Messages();
        $sms->from_user = $_POST['username'];
        $sms->to_user = $_POST['user_to'];
        $sms->text = $_POST['text'];
        $sms->data = date("Y-m-d H:i:s");
        $sms->status = 0;
        if ($sms->save()) {
            \Yii::$app->session->setFlash('success', 'Сообщение отправлено');
            $this->redirect(Yii::$app->request->referrer);
        } else {
            \Yii::$app->session->setFlash('error', 'Ошибка отправки сообщения');
            $this->redirect(Yii::$app->request->referrer);
        }
    }

    public function actionApplySaveFilter()
    {
        Yii::$app->session->open();
        $str = SaveFilters::findOne($_POST['nabor']);
        $parts = json_decode($str['text']);
        $f1 = json_decode($parts->filter);
        $f2 = json_decode($parts->filter_range);
        if (empty($f1)){
            foreach ($f2 as $key=>$value){
                $_SESSION['filters_range'][$key]['min'] = $value->min;
                $_SESSION['filters_range'][$key]['max'] = $value->max;
            }
        }
        if (empty($f2)){
            foreach ($f2 as $key=>$value){
                $_SESSION['filters_range'][$key]['min'] = $value->min;
                $_SESSION['filters_range'][$key]['max'] = $value->max;
            }
        }

        return $this->redirect(Yii::$app->request->referrer);
    }

    public function actionPCity(){
//        $regions = GeoRegion::find()->all();
//        foreach ($regions as $region){
//            $json = file_get_contents('https://dom.ria.com/node/api/getCities/state_id/'.$region['id'].'/?lang_id=2');
//            $city = json_decode($json);
//            foreach ($city as $cit){
//                $model = new GeoCity();
//                $model->id = $cit->cityID;
//                $model->name = $cit->name;
//                $model->region = $cit->stateID;
//                $model->save();
//            }
//        }

        $cities = GeoCity::find()->all();
        foreach ($cities as $city){
            $json = file_get_contents('https://dom.ria.com/node/api/getPopularDistricts/city_id/'.$city['id'].'/?lang_id=2');
            $areas = json_decode($json);
            foreach ($areas[0] as $area){
                if ($area->name!='Район') {
                    $model = new GeoArea();
                    $model->region = $city['region'];
                    $model->city = $city['id'];
                    $model->name = $area->name;
                    $model->id = $area->area_id;
                    $model->save();
                }
            }
        }
    }

    public function actionOlxOne(){
        $start = microtime(true);
        $model = Parser::findOne(['status'=>0]);
        if (empty($model)){
            exit;
        }
        $client = new Client();
        // отправляем запрос к странице Яндекса
        $res = $client->request('GET', $model['url']);

        // получаем данные между открывающим и закрывающим тегами body
        $body = $res->getBody();
        // подключаем phpQuery
        $document = \phpQuery::newDocumentHTML($body);

        $old = $document->find('.lheight20 strong')->text();
        if ($old=='') {
            /*** Print ***/
            $print = $client->request('GET', str_replace('obyavlenie', 'print', $model['url']));
            // получаем данные между открывающим и закрывающим тегами body
            $bodyPrint = $print->getBody();
            // подключаем phpQuery
            $documentPrint = \phpQuery::newDocumentHTML($bodyPrint);
            $phone = $documentPrint->find("#footer-container .phone strong")->text();
            $phone = '+38' . str_replace([' ', '+38'], '', $phone);
            /*** end ***/

            $price = $document->find(".price-label strong")->text();
            if (strpos($price, 'грн')){
                $price = str_replace([' ', 'грн.'], '', $price);
                $currency = 1;
            } else {
                $price = str_replace([' ', '$'], '', $price);
                $currency = 2;
            }
            $address = $document->find(".show-map-link strong")->text();
            $adr = explode(',', $address);
            $city = trim($adr[0]);
            $region = trim(str_replace('область', '', $adr[1]));
            $area = trim($adr[2]);
            $author = $document->find(".offer-user__details h4 a")->text();

            $text = $document->find("#textContent")->text();

            $item = new Items();
            $item->date_create = date("Y-m-d H:i:s");
            $item->user = 0;
            $item->status = 1;
            $item->region = GeoRegion::findOne(['name' => $region])['id'];
            $item->city = GeoCity::findOne(['name' => $city])['id'];
            $item->area = GeoArea::findOne(['name' => $area])['id'];
            $item->save();
            $max = Yii::$app->db->getLastInsertID();
            /*** -= Props =- ***/
            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 24;
            $prop->value = $price;
            $prop->value_int = (int)$price;
            $prop->save();

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 5;
            $prop->value = trim($author);
            $prop->value_int = (int)$author;
            $prop->save();

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 18;
            $prop->value = trim($text);
            $prop->value_int = (int)$text;
            $prop->save();

            $prop = $document->find(".full tr .item tr");
            foreach ($prop as $tr) {
                $pq = pq($tr);
                $head = $pq->find('th')->text();
                switch ($head) {
                    case 'Количество комнат':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 7;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;

                    case 'Общая площадь':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 10;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;

                    case 'Жилая площадь':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 11;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;

                    case 'Площадь кухни':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 12;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;

                    case 'Тип':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 19;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;

                    case 'Этаж':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 8;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;

                    case 'Этажность дома':
                        $prop = new ItemProp();
                        $prop->item_id = $max;
                        $prop->row_id = 9;
                        $prop->value = preg_replace('~[^0-9]+~', '', $pq->find('.value')->text());
                        $prop->value_int = (int)$pq->find('.value')->text();
                        $prop->save();
                        break;
                }
            }

            $images = $document->find("#bigGallery a");
            $img = [];
            foreach ($images as $image) {
                $pq = pq($image);
//            $nameFile = explode('/', $pq->attr('href'));
//            $file = array_pop($nameFile);
//            copy($pq->attr('href'), $_SERVER['DOCUMENT_ROOT'].'/frontend/web/source/items/'.$file);
                $img[] = $pq->attr('href');
            }

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 29;
            $prop->value = json_encode($img);
            $prop->value_int = (int)json_encode($img);
            $prop->save();

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 6;
            $prop->value = $phone;
            $prop->value_int = (int)$phone;
            $prop->save();

            /*** -= Steps =- ***/
            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 1;
            $prop->value = 1;
            $prop->value_int = (int)1;
            $prop->save();

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 2;
            $prop->value = 1;
            $prop->value_int = (int)1;
            $prop->save();

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 3;
            $prop->value = 1;
            $prop->value_int = (int)1;
            $prop->save();

            $prop = new ItemProp();
            $prop->item_id = $max;
            $prop->row_id = 25;
            $prop->value = $currency;
            $prop->value_int = (int)$currency;
            $prop->save();
        }
        $model->status = 1;
        $model->save();

        echo 'Success. Время выполнения скрипта: ' . ceil((microtime(true) - $start)) . ' сек.';
    }

    public function actionOlxOneNew(){
        $start = microtime(true);
        $proxy = Proxy::find()->orderBy(new Expression('rand()'))->one();
        $model = Parser::findOne(['status'=>0]);
        if (empty($model)){
            exit;
        }
        $client = new Client();
        $res = $client->request('GET', str_replace('obyavlenie', 'print', $model['url']), ['proxy' => $proxy['host'].':'.$proxy['port']]);


        // получаем данные между открывающим и закрывающим тегами body
        $body = $res->getBody();
        // подключаем phpQuery
        $document = \phpQuery::newDocumentHTML($body);

        /*** -= Работа с адресом =- ***/
        $address = $document->find('h3')->html();
        $address = explode('<small>', $address);
        $address = trim($address[0]);
        $geolocation = explode(',', $address);
        $city = trim($geolocation[0]);
        $region = trim(str_replace('область', '', $geolocation[1]));
        $area = trim($geolocation[2]);
        /*** -= END =- ***/

        /*** -= Определение контакта =- ***/
        $nameUser = $document->find('.person strong')->text();
        $phoneUser = $document->find('.phone strong')->html();
        $phoneUser = explode('</span>', $phoneUser);
        $phoneUser = trim(strip_tags($phoneUser[0]));
        /*** -= END =- ***/

        //echo $phoneUser;exit;

        /*** -= Сохранение объявления =- ***/
        $item = new Items();
        $item->date_create = date("Y-m-d H:i:s");
        $item->user = 0;
        $item->status = 2;
        $item->source = 2;
        $item->link = $model['url'];
        $item->region = GeoRegion::findOne(['name' => $region])['id'];
        $item->city = GeoCity::findOne(['name' => $city])['id'];
        $item->area = GeoArea::findOne(['name' => $area])['id'];
        $item->save();
        /*** -= END =- ***/

        $max = Yii::$app->db->getLastInsertID();

        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 5;
        $prop->value = $nameUser;
        $prop->value_int = (int)$nameUser;
        $prop->save();

        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 6;
        $prop->value = $phoneUser;
        $prop->value_int = (int)$phoneUser;
        $prop->save();

        /*** -= Категории =- ***/
        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 1;
        $prop->value = $model['step'][0];
        $prop->value_int = (int)$phoneUser;
        $prop->save();

        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 2;
        $prop->value = $model['step'][1];
        $prop->value_int = (int)$phoneUser;
        $prop->save();

        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 3;
        $prop->value = $model['step'][2];
        $prop->value_int = (int)$phoneUser;
        $prop->save();
        /*** -= END =- ***/

        /*** -= Text =- ***/
        $text = trim($document->find('#body-container p')->text());
        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 18;
        $prop->value = $text;
        $prop->value_int = (int)$text;
        $prop->save();
        /*** -= END =- ***/

        /*** -= Props =- ***/
        $table = $document->find('.details tr');
        foreach ($table as $tr) {
            $pq = pq($tr);
            $head = trim($pq->find('th')->text());
            if ($head=='Цена'){
                $value = trim($pq->find('td')->text());
                if (substr_count($value, 'грн')>0){
                    $prop = new ItemProp();
                    $prop->item_id = $max;
                    $prop->row_id = 25;
                    $prop->value = 1;
                    $prop->value_int = 1;
                    $prop->save();
                } else {
                    $prop = new ItemProp();
                    $prop->item_id = $max;
                    $prop->row_id = 25;
                    $prop->value = 2;
                    $prop->value_int = 2;
                    $prop->save();
                }

                $prop = new ItemProp();
                $prop->item_id = $max;
                $prop->row_id = 24;
                $prop->value = trim(preg_replace('~[^0-9]+~', '', $pq->find('td')->text()));
                $prop->value_int = (int)trim(preg_replace('~[^0-9]+~', '', $pq->find('td')->text()));
                $prop->save();
            } else if ($head=='Общая площадь'){
                $value = trim(str_replace('м²', '', $pq->find('td')->text()));
                $propertis = new ItemProp();
                $propertis->item_id = $max;
                $propertis->row_id = 10;
                $propertis->value = $value;
                $propertis->value_int = (int)$value;
                $propertis->save();
            } else if ($head=='Площадь кухни'){
                $value = trim(str_replace('м²', '', $pq->find('td')->text()));
                $value = trim(str_replace('м²', '', $pq->find('td')->text()));
                $propertis = new ItemProp();
                $propertis->item_id = $max;
                $propertis->row_id = 12;
                $propertis->value = $value;
                $propertis->value_int = (int)$value;
                $propertis->save();
            } else {
                $value = trim(str_replace('м²', '', $pq->find('td')->text()));
                $prop = Rows::findOne(['name'=>$head]);
                if (empty($prop)){
                    $prop = new Rows();
                    $prop->step_id = 3;
                    $prop->type = 1;
                    $prop->name = $head;
                    $prop->status = 1;
                    $prop->required = 0;
                    $prop->filter = 0;
                    $prop->save();
                    $propId = Yii::$app->db->getLastInsertID();
                    $propertis = new ItemProp();
                    $propertis->item_id = $max;
                    $propertis->row_id = $propId;
                    $propertis->value = $value;
                    $propertis->value_int = (int)$value;
                    $propertis->save();
                } else {
                    $propertis = new ItemProp();
                    $propertis->item_id = $max;
                    $propertis->row_id = $prop['id'];
                    $propertis->value = $value;
                    $propertis->value_int = (int)$value;
                    $propertis->save();
                }
            }
        }

        $images = $document->find(".gallery p img");
        $img = [];
        foreach ($images as $image) {
            $pq = pq($image);
            $img[] = $pq->attr('src');
        }

        $prop = new ItemProp();
        $prop->item_id = $max;
        $prop->row_id = 29;
        $prop->value = json_encode($img);
        $prop->value_int = (int)json_encode($img);
        $prop->save();

        $model->status = 1;
        $model->save();

        echo 'Success. Время выполнения скрипта: ' . ceil((microtime(true) - $start)) . ' сек.';
    }

    public function actionOlx(){
        $urls = [
            '311' => 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/arenda-kvartir-komnat/kvartira/zaporozhe/?search%5Bprivate_business%5D=private',
            '314' => 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/arenda-kvartir-komnat/komnata/zaporozhe/?search%5Bprivate_business%5D=private',
            '312' => 'https://www.olx.ua/nedvizhimost/doma/arenda-domov/zaporozhe/?search%5Bprivate_business%5D=private',
            '111' => 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/prodazha-kvartir-komnat/kvartira/zaporozhe/?search%5Bprivate_business%5D=private',
            '114' => 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/prodazha-kvartir-komnat/komnata/zaporozhe/?search%5Bprivate_business%5D=private',
            '113' => 'https://www.olx.ua/nedvizhimost/doma/prodazha-domov/zaporozhe/?search%5Bprivate_business%5D=private',
            '112' => 'https://www.olx.ua/nedvizhimost/doma/prodazha-domov/zaporozhe/?search%5Bprivate_business%5D=private',
        ];
        foreach ($urls as $mask=>$url) {
            $start = microtime(true);
            $client = new Client();
            // отправляем запрос к странице Яндекса
            $res = $client->request('GET', $url);
            // получаем данные между открывающим и закрывающим тегами body
            $body = $res->getBody();
            // подключаем phpQuery
            $document = \phpQuery::newDocumentHTML($body);
            $ads = $document->find('#offers_table tr.wrap');
            foreach ($ads as $ad) {
                $pq = pq($ad);
                $url = $pq->find('a.thumb')->attr('href');
                $ex = Parser::findOne(['url' => $url]);
                if (empty($ex)) {
                    $model = new Parser();
                    $model->url = $url;
                    $model->step = $mask;
                    $model->save();
                }
            }
            echo 'Success. Время выполнения скрипта: ' . ceil((microtime(true) - $start)) . ' сек.';
        }
    }

    public function actionGetProxy(){
        $res = json_decode(file_get_contents('https://hidemy.name/ru/api/proxylist.php?out=js&maxtime=500&code=182502601435408'));
        if (!empty($res)) {
            Proxy::deleteAll();
            foreach ($res as $row) {
                $model = new Proxy();
                $model->host = $row->host;
                $model->port = $row->port;
                $model->country_code = $row->country_code;
                $model->country_name = $row->country_name;
                $model->save();
            }
        }
    }
}
