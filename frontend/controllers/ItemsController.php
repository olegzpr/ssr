<?php

namespace frontend\controllers;

use backend\models\Category;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\ItemStatics;
use backend\models\Steps;
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

/**
 * Site controller
 */
class ItemsController extends Controller
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
    public function actionAdd()
    {
        $category = Category::find()->where(['status' => 1])->all();
        return $this->render('add', [
            'category' => $category
        ]);
    }

    public function actionStep()
    {
        if (Yii::$app->request->get('mask')){
            Yii::$app->session->set('mask', Yii::$app->request->get('mask'));
        }
        if (Yii::$app->request->post()) {
            if (!Yii::$app->request->get('id')) {
                if (!Yii::$app->request->get('step')) {
                    Yii::$app->session->set('mask', Yii::$app->request->post('Rows')[1] . Yii::$app->request->post('Rows')[2] . Yii::$app->request->post('Rows')[3]);
                }


                $uid = Yii::$app->user->isGuest ? Yii::$app->session->id : Yii::$app->user->identity->id;
                $item = Items::findOne(['user' => $uid, 'status' => -1]);
                if (empty($item)) {
                    $item = new Items();
                    $item->date_create = date("Y-m-d H:i:s");
                    if (!Yii::$app->session->isActive) {
                        Yii::$app->session->open();
                    }
                    if (Yii::$app->user->isGuest) {
                        $item->user = Yii::$app->session->id;
                    } else {
                        $item->user = Yii::$app->user->identity->id;
                    }
                    $item->status = -1;
                    $item->save();
                    $id = Yii::$app->db->getLastInsertID();
                } else {
                    $id = $item['id'];
                }
            } else {
                $id = Yii::$app->request->get('id');
                $item = Items::findOne($id);
            }

            /*** -= Поиск максимального шага =- ***/
            $maxStep = Steps::find()->where(['mask' => Yii::$app->session->get('mask')])->orderBy('id desc')->one()['id'];
            /*** -= Определяю шаги ***/
            if (Yii::$app->request->get('step')) {
                $nextStep = Yii::$app->request->get('step') + 1;
            } else {
                $nextStep = Steps::findOne(['mask' => Yii::$app->session->get('mask')])['id'];
            }

            /*** -= Специально для сохранения карты =- ***/
            if (Yii::$app->request->post('Maps')) {
                $item->region = Yii::$app->request->post('Maps')['region'];
                $item->city = Yii::$app->request->post('Maps')['city'];
                if (isset($_POST['Maps']['area'])) {
                    $item->area = Yii::$app->request->post('Maps')['area'];
                }
                $item->save();
            }

            foreach ($_POST['Rows'] as $key => $value) {
                $exit = ItemProp::findOne(['item_id' => $id, 'row_id' => $key]);
                if (empty($exit)) {
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
                    $exit->value = $value;
                    $exit->value_int = $value;
                    $exit->save();
                }
            }

            if ($nextStep > $maxStep) {
                $item->status = 1;
                $item->save();
                return $this->render('success');
            } else {
                if (Yii::$app->request->get('id')) {
                    return $this->redirect('/add/step?step=' . $nextStep . '&id=' . Yii::$app->request->get('id'));
                } else {
                    return $this->redirect('/add/step?step=' . $nextStep);
                }
            }
        }

        return $this->render('step');
    }

    public function actionSave()
    {
        if (Yii::$app->request->post()) {
            if (!$_GET['id']) {
                $item = Items::findOne(['user' => Yii::$app->user->identity->id, 'status' => -1]);
            } else {
                $item = Items::findOne(Yii::$app->request->get('id'));
            }
            $id = $item['id'];
            foreach ($_POST['Rows'] as $key => $value) {
                $exit = ItemProp::findOne(['item_id' => $id, 'row_id' => $key]);
                if (empty($exit)) {
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
                    $exit->value = $value;
                    $exit->value_int = $value;
                    $exit->save();
                }
            }

            $item->status = 1;
            $item->save();
            $this->refresh();
        }

        return $this->render('step-6');
    }

    public function actionDeactive()
    {
        $id = Yii::$app->request->post('id');
        $item = Items::findOne($id);
        $item->status = 5;
        $item->save();
    }

    public function actionActive()
    {
        $id = Yii::$app->request->post('id');
        $item = Items::findOne($id);
        $item->status = 1;
        $item->save();
    }

    public function actionReklama()
    {
        $id = Yii::$app->request->post('id');
        $item = Items::findOne($id);
        $today = new \DateTime();
        $item_date = new \DateTime($item['date_create']);
        $diff = $today->diff($item_date);
        if ($diff->format('%d') > 7) {
            $item->date_create = date("Y-m-d H:i:s");
            $item->save();
            return json_encode(['type' => 'success', 'sms' => 'Ваше объявление поднято в списке']);
        } else {
            return json_encode(['type' => 'error', 'sms' => 'Бесплатное поднятие доступно только раз в 7 дней']);
        }
    }

    public function actionViewPhone()
    {
        $sess = Yii::$app->session;
        if (!$sess->isActive) {
            $sess->open();
        }
        $uid = $sess->getId();
        $id = Yii::$app->request->post('id');
        $exits = \backend\models\ItemStatics::findOne(['item_id' => $id, 'type' => 'view-phone', 'session' => $uid]);
        if (empty($exits)) {
            $static = new \backend\models\ItemStatics();
            $static->item_id = $id;
            $static->type = 'view-phone';
            $static->session = $uid;
            if (!$static->save()) {
                print_r($static->getErrors());
            }
            return 'Ok';
        } else {
            return 'Error';
        }
    }
}
