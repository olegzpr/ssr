<?php

namespace frontend\controllers;

use backend\models\Alerts;
use backend\models\Category;
use backend\models\Contacts;
use backend\models\ContactType;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\ItemStatics;
use backend\models\Privates;
use backend\models\Settings;
use backend\models\Steps;
use common\models\Helper;
use common\models\User;
use frontend\models\Favorites;
use Yii;
use yii\base\InvalidParamException;
use yii\helpers\ArrayHelper;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use backend\models\Notes;
use backend\models\LabelItems;
use backend\models\Labels;
use lavrentiev\widgets\toastr\Notification;
use yii\imagine\Image;
use Mobizon\MobizonApi;

/**
 * Site controller
 */
class MyController extends Controller
{

    //public $layout='personal';
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['index'],
                'rules' => [
                    [
                        'actions' => ['index'],
                        'allow' => true,
                        'roles' => ['@'],
                    ]
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

    public function actionIndex()
    {
        $model = User::findOne(Yii::$app->user->identity->id);
        if (Yii::$app->request->post()) {
            $model->name = $_POST['User']['name'];
            $model->lastname = $_POST['User']['lastname'];
            $model->middlename = $_POST['User']['middlename'];
            if (Yii::$app->request->post('User')['pass'] != '') {
                if (Yii::$app->request->post('User')['pass'] == Yii::$app->request->post('User')['pass2']) {
                    $model->setPassword(Yii::$app->request->post('User')['pass']);
                    $model->generateAuthKey();
                    Notification::widget([
                        'type' => 'error',
                        'title' => 'Пароль изменен',
                        'message' => 'Вы успешно изменили пароль'
                    ]);
                } else {
                    Notification::widget([
                        'type' => 'error',
                        'title' => 'Пароль не изменен',
                        'message' => 'Введенные пароли не совпадают'
                    ]);
                }
            }
            $model->save();
        }
        return $this->render('index', [
            'model' => $model
        ]);
    }

    public function actionItems()
    {
        $items = Items::find()->where(['user' => Yii::$app->user->identity->id, 'status' => [1, 2, 3, 4, 5]])->all();
        $html = '';
        foreach ($items as $item) {
            $types = ItemProp::findOne(['item_id' => $item['id'], 'row_id' => 1]);
            $types2 = ItemProp::findOne(['item_id' => $item['id'], 'row_id' => 2]);
            $types3 = ItemProp::findOne(['item_id' => $item['id'], 'row_id' => 3]);

            $mask = $types['value'].$types2['value'].$types3['value'];
            $minStep = Steps::findOne(['mask'=>$mask]);

            if ($types['value'] == 1 || $types['value'] == 3) {
                /*** формирование времени подачи объявления ***/
                $date = new \DateTime($item['date_create']);
                $now = new \DateTime();
                $diff = $date->diff($now);
                $item_add_date = '';
                if ($diff->format('%d') > 0) {
                    $item_add_date = 'Добавлено ' . $diff->format('%d') . ' д. назад';
                } else if ($diff->format('%H') > 0) {
                    $item_add_date = 'Добавлено ' . $diff->format('%H') . ' ч. назад';
                } else if ($diff->format('%m') > 0) {
                    $item_add_date = 'Добавлено ' . $diff->format('%m') . ' м. назад';
                } else {
                    $item_add_date = 'Добавлено ' . $diff->format('%s') . ' c. назад';
                }

                /*** Status ***/
                switch ($item['status']) {
                    case '1':
                        $status = '<div>Объявление скоро появится на сайте</div>';
                        break;

                    case '2':
                        $status = '<div class="success"><i class="fa fa-check"></i> Объявление активно и показывается на сайте</div>';
                        break;

                    case '3':
                        $status = '<div class="error"><i class="fa fa-times-circle-o"></i> Модератор отменил публикацию, внесите изменения
</div>';
                        break;

                    case '5':
                        $status = '<div class="error"><i class="fa fa-times-circle-o"></i> Модератор отменил публикацию, требуется ваше внимание
</div>';
                        break;

                    case '4':
                        $status = '<div>Объявление скоро появится на сайте</div>';
                }

                $currency = \frontend\models\Items::getPropLabel($item['id'], '_currency_');
                $iname = Helper::titleFormatItem($item['id']);
                $html .= $this->renderPartial('elements/_item', [
                    'name' => $iname,
                    'img' => Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_'))[0],
                    'date_add' => $item_add_date,
                    'views' => ItemStatics::find()->where(['item_id' => $item['id'], 'type' => 'view'])->count(),
                    'view_phone' => ItemStatics::find()->where(['item_id' => $item['id'], 'type' => 'view-phone'])->count(),
                    'favorite' => Favorites::find()->where(['item_id' => $item['id']])->count(),
                    'hidden' => 0,
                    'price' => $currency == 2 ? \frontend\models\Items::getPropLabel($item['id'], '_price_') * Settings::findOne(1)['value'] . ' usd' : \frontend\models\Items::getPropLabel($item['id'], '_price_') . ' грн',
                    'status' => $status,
                    'st' => $item['status'],
                    'url' => '/catalog/' . \common\models\Helper::str2url($iname) . '-' . $item['id'],
                    'id' => $item['id'],
                    'minStep' => $minStep['id'],
                    'mask' => $mask
                ]);
            }
        }
        $activeMenu = '/my/items';

        return $this->render('items', compact('html', 'activeMenu'));
    }

    public function actionBids()
    {
        $items = Items::find()->where(['user' => Yii::$app->user->identity->id, 'status' => [1, 2, 3, 4, 5]])->all();
        $html = '';
        foreach ($items as $item) {
            $types = ItemProp::findOne(['item_id' => $item['id'], 'row_id' => 1]);
            $types2 = ItemProp::findOne(['item_id' => $item['id'], 'row_id' => 2]);
            $types3 = ItemProp::findOne(['item_id' => $item['id'], 'row_id' => 3]);

            $mask = $types['value'].$types2['value'].$types3['value'];
            $minStep = Steps::findOne(['mask'=>$mask]);
            if ($types['value'] == 2 || $types['value'] == 3) {
                /*** формирование времени подачи объявления ***/
                $date = new \DateTime($item['date_create']);
                $now = new \DateTime();
                $diff = $date->diff($now);
                $item_add_date = '';
                if ($diff->format('%d') > 0) {
                    $item_add_date = 'Добавлено ' . $diff->format('%d') . ' д. назад';
                } else if ($diff->format('%H') > 0) {
                    $item_add_date = 'Добавлено ' . $diff->format('%H') . ' ч. назад';
                } else if ($diff->format('%m') > 0) {
                    $item_add_date = 'Добавлено ' . $diff->format('%m') . ' м. назад';
                } else {
                    $item_add_date = 'Добавлено ' . $diff->format('%s') . ' c. назад';
                }

                /*** Status ***/
                switch ($item['status']) {
                    case '1':
                        $status = '<div>Объявление скоро появится на сайте</div>';
                        break;

                    case '2':
                        $status = '<div class="success"><i class="fa fa-check"></i> Объявление активно и показывается на сайте</div>';
                        break;

                    case '3':
                        $status = '<div class="error"><i class="fa fa-times-circle-o"></i> Модератор отменил публикацию, внесите изменения
</div>';
                        break;

                    case '4':
                        $status = '<div>Объявление скоро появится на сайте</div>';
                }

                $currency = \frontend\models\Items::getPropLabel($item['id'], '_currency_');
                $iname = Helper::titleFormatItem($item['id']);
                $html .= $this->renderPartial('elements/_item', [
                    'name' => $iname,
                    'img' => Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_'))[0],
                    'date_add' => $item_add_date,
                    'views' => ItemStatics::find()->where(['item_id' => $item['id'], 'type' => 'view'])->count(),
                    'view_phone' => ItemStatics::find()->where(['item_id' => $item['id'], 'type' => 'view-phone'])->count(),
                    'favorite' => Favorites::find()->where(['item_id' => $item['id']])->count(),
                    'hidden' => 0,
                    'price' => $currency == 2 ? \frontend\models\Items::getPropLabel($item['id'], '_price_') * Settings::findOne(1)['value'] . ' usd' : \frontend\models\Items::getPropLabel($item['id'], '_price_') . ' грн',
                    'status' => $status,
                    'st' => $item['status'],
                    'url' => '/catalog/' . \common\models\Helper::str2url($iname) . '-' . $item['id'],
                    'id' => $item['id'],
                    'minStep' => $minStep['id'],
                    'mask' => $mask

                ]);
            }
        }

        $activeMenu = '/my/bids';

        return $this->render('items', compact('html', 'activeMenu'));
    }

    public function actionItemEdit($id)
    {
        $category = Category::find()->where(['status' => 1])->all();
        $this->viewPath = $_SERVER['DOCUMENT_ROOT'] . '/frontend/views/items';
        $item = Items::findOne($id);
        if (Yii::$app->request->post()) {
            $item->date_update = date("Y-m-d H:i:s");
            $item->status = 4;
            if ($item->save()) {
                $id = $item['id'];
                foreach ($_POST['Rows'] as $key => $value) {
                    $prop = ItemProp::find()->where(['item_id' => $id, 'row_id' => $key])->one();
                    if (empty($prop)) {
                        $prop = new ItemProp();
                        $prop->item_id = $id;
                        $prop->row_id = $key;
                        if (is_array($value)) {
                            $value = json_encode($value);
                        }
                        $prop->value = $value;
                        $prop->value_int = $value;
                        $prop->save();
                    } else {
                        if (is_array($value)) {
                            $value = json_encode($value);
                        }
                        $prop->value = $value;
                        $prop->value_int = $value;
                        $prop->save();
                    }
                }
                return Yii::$app->response->redirect('/my/items');
            } else {
                print_r($item->getErrors());
            }
        }
        return $this->render('edit', [
            'category' => $category,
            'item' => $item
        ]);
    }

    public function actionFavorite()
    {
        $uid = Yii::$app->user->identity->id;
        $favorites = Favorites::find()->where(['user_id' => Yii::$app->user->identity->id])->all();
        $html = '';
        foreach ($favorites as $fav) {
            $item = Items::findOne($fav['item_id']);
            /*** построение ссылки ***/
            $name = Helper::titleFormat($item['id']);
            //$category = \frontend\models\Category::findOne($item['category']);
            $url = '/catalog/' . \common\models\Helper::str2url($name) . '-' . $item['id'];

            /*** формирование времени подачи объявления ***/
            $date = new \DateTime($item['date_create']);
            $now = new \DateTime();
            $diff = $date->diff($now);
            $item_add_date = '';
            if ($diff->format('%d') > 0) {
                $item_add_date = 'Добавлено ' . $diff->format('%d') . ' д. назад';
            } else if ($diff->format('%H') > 0) {
                $item_add_date = 'Добавлено ' . $diff->format('%d') . ' ч. назад';
            } else if ($diff->format('%m') > 0) {
                $item_add_date = 'Добавлено ' . $diff->format('%d') . ' м. назад';
            } else {
                $item_add_date = 'Добавлено ' . $diff->format('%d') . ' c. назад';
            }
            /*** Перевірка на наявність замітки***/
            $note = Notes::findOne(['user_id' => $uid, 'item_id' => $item['id']]);
            if (!empty($note)) {
                $note_class = 'active';
                $note_action = 'open-edit-modal-note';
            } else {
                $note_class = '';
                $note_action = 'open-modal-note';
            }

            /*** Перевірка на наявність мітки***/
            $label = LabelItems::find()->where(['item_id' => $item['id'], 'user_id' => $uid])->one();
            if (!empty($label)) {
                $label_class = 'active';
                $label_info = Labels::findOne($label['label_id']);
                $label_icon = '<i class="fa ' . $label_info['icon'] . '"></i>';
            } else {
                $label_class = '';
                $label_icon = '<span></span><span></span><span></span>';
            }
            $this->viewPath = '@app/views/catalog';
            $html .= $this->renderPartial('_catalog_item', [
                'image' => Helper::getPicture(\frontend\models\Items::getProp($item['id'], '_photo_')),
                'url' => $url,
                'name' => $name,
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_') == 2 ? \frontend\models\Items::getPropLabel($item['id'], '_price_') * Settings::findOne(1)['value'] : \frontend\models\Items::getPropLabel($item['id'], '_price_'),
                'phone' => \frontend\models\Items::getPropLabel($item['id'], '_phone_'),
                'place' => \frontend\models\Items::getPropLabel($item['id'], '_place_'),
                'etag' => \frontend\models\Items::getPropLabel($item['id'], '_etag_'),
                'desc' => \frontend\models\Items::getPropLabel($item['id'], '_desc_'),
                'date_add' => $item_add_date,
                'id' => $item['id'],
                'note' => [
                    'class' => $note_class,
                    'action' => $note_action
                ],
                'label' => [
                    'class' => $label_class,
                    'icon' => $label_icon
                ],
                'date' => strtotime($item['date_create'])
            ]);
        }
        $this->viewPath = '@app/views/my';
        return $this->render('favorite', [
            'html' => $html
        ]);
    }

    public function actionFavoriteDelete($id)
    {
        $fav = Favorites::findOne($id);
        $fav->delete();
        return $this->redirect(Yii::$app->request->referrer);
    }

    public function actionSms()
    {
        $sender = [];
        $res = Yii::$app->db->createCommand("select distinct(to_user) from messages where from_user='" . Yii::$app->user->identity->username . "'")->queryAll();
        foreach ($res as $row) {
            $sender[] = $row['to_user'];
        }

        $res = Yii::$app->db->createCommand("select distinct(from_user) from messages where to_user='" . Yii::$app->user->identity->username . "'")->queryAll();
        foreach ($res as $row) {
            $sender[] = $row['from_user'];
        }

        $sender = array_unique($sender);
        return $this->render('sms', [
            'sender' => $sender
        ]);
    }

    public function actionAddContact()
    {
        $types = ContactType::find()->all();
        $model = new Contacts();
        if (Yii::$app->request->post() && $model->load(Yii::$app->request->post())) {
            $model->user = Yii::$app->user->identity->id;
            $model->params = json_encode(Yii::$app->request->post('Contacts')['params']);
            if ($model->save()) {
                return $this->renderPartial('elements/_list_contact.php');
            } else {
                return Helper::error($model->getErrors());
            }
        }
        return $this->renderPartial('elements/_add_contact.php', ['types' => ArrayHelper::map($types, 'id', 'name'), 'model' => $model, 'program' => $model::$program]);
    }

    public function actionContactEdit()
    {
        $types = ContactType::find()->all();
        $id = Yii::$app->request->get('id');
        $model = Contacts::findOne($id);
        if (Yii::$app->request->post() && $model->load(Yii::$app->request->post())) {
            $model->user = Yii::$app->user->identity->id;
            $model->params = json_encode(Yii::$app->request->post('Contacts')['params']);
            if ($model->save()) {
                return $this->renderPartial('elements/_list_contact.php');
            } else {
                return Helper::error($model->getErrors());
            }
        }
        return $this->renderPartial('elements/_add_contact.php', ['types' => ArrayHelper::map($types, 'id', 'name'), 'model' => $model, 'program' => $model::$program]);
    }

    public function actionSettings()
    {
        if (Yii::$app->request->post()) {
            foreach (Yii::$app->request->post('Privates') as $key => $value) {
                $priv = new Privates();
                $priv->user = Yii::$app->user->identity->id;
                $priv->private_id = $key;
                $priv->value = $value;
                $priv->save();
            }
        }
        return $this->render('settings');
    }

    public function actionVarification()
    {
        return $this->render('varification');
    }

    public function actionAlerts()
    {
        if (Yii::$app->request->post()) {
            /*** -= Збереження пошт =- ***/
            foreach (Yii::$app->request->post('Email') as $key => $value) {
                foreach ($value as $contact) {
                    $alert = new Alerts();
                    $alert->user = Yii::$app->user->identity->id;
                    $alert->alert_type = $key;
                    $alert->contact_id = $contact;
                    $alert->save();
                }
            }

            /*** -= Збереження телефонів =- ***/
            foreach (Yii::$app->request->post('App') as $key => $value) {
                foreach ($value as $key_app => $app) {
                    foreach ($app as $contact) {
                        $alert = new Alerts();
                        $alert->user = Yii::$app->user->identity->id;
                        $alert->alert_type = $key;
                        $alert->contact_id = $contact;
                        $alert->chanel = $key_app;
                        $alert->save();
                    }
                }
            }
        }
        return $this->render('alerts');
    }

    public function actionItemStatic()
    {
        $id = Yii::$app->request->get('id');
        $arr1 = [];
        $arr2 = [];
        for ($i = 7; $i >= 0; $i--) {
            $date = date("Y-m-d", strtotime("-" . $i . " days"));
            $data1 = ItemStatics::find()->where(['AND', ['>=', 'data', $date . ' 00:00:00'], ['<=', 'data', $date . ' 23:59:59'], ['type' => 'view'], ['item_id' => $id]])->count();
            $arr1[] = $date;
            $arr2[] = $data1;
        }

        $arr3 = [];
        $arr4 = [];
        for ($i = 7; $i >= 0; $i--) {
            $date = date("Y-m-d", strtotime("-" . $i . " days"));
            $data1 = ItemStatics::find()->where(['AND', ['>=', 'data', $date . ' 00:00:00'], ['<=', 'data', $date . ' 23:59:59'], ['type' => 'view-phone'], ['item_id' => $id]])->count();
            $arr3[] = $date;
            $arr4[] = $data1;
        }
        return $this->render('static', [
            'data1' => ['label' => implode('", "', $arr1), 'value' => implode('", "', $arr2)],
            'data2' => ['label' => implode('", "', $arr3), 'value' => implode('", "', $arr4)]
        ]);
    }

    public function actionNotifications()
    {
        $sysNotify = \backend\models\SystemNotifications::find()->where(['OR', ['user'=>null], ['user'=>Yii::$app->user->identity->username]])->orderBy('data desc')->all();
        return $this->render('notifications', compact('sysNotify'));
    }

    public function actionSaveCover()
    {
        Image::crop('../web/'.Yii::$app->request->post('image'), Yii::$app->request->post('width'), Yii::$app->request->post('height'), [Yii::$app->request->post('x'), Yii::$app->request->post('y')])->save('../web/'.Yii::$app->request->post('image'));
        $user = User::findOne(Yii::$app->user->identity->id);
        $user->cover = json_encode([Yii::$app->request->post('image')]);
        if ($user->save()) {
            return json_encode(['error' => null]);
        } else {
            return json_encode(['error' => $user->getErrors()]);
        }
    }

    public function actionSaveAvatar()
    {
        Image::crop('../web/'.Yii::$app->request->post('image'), Yii::$app->request->post('width'), Yii::$app->request->post('height'), [Yii::$app->request->post('x'), Yii::$app->request->post('y')])->save('../web/'.Yii::$app->request->post('image'));
        $user = User::findOne(Yii::$app->user->identity->id);
        $user->photo = json_encode([Yii::$app->request->post('image')]);
        if ($user->save()) {
            return json_encode(['error' => null]);
        } else {
            return json_encode(['error' => $user->getErrors()]);
        }
    }

    public function actionShare(){
        return $this->render('share');
    }

    public function actionShareSms(){
        $api = new MobizonApi('91f8cd3cd111673fd8c80b6276baac2fe527f179');
        $api->call('message',
            'sendSMSMessage',
            array(
                'recipient' => Yii::$app->request->post('phone'),
                'text' => 'Поиск квартир без посредников - '.$_SERVER['HTTP_HOST']
            ));

        return 'Сообщение отправлено | '.$api->getData('messageId');
    }
}
