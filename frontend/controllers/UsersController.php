<?php
namespace frontend\controllers;

use backend\models\Category;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\LabelItems;
use backend\models\Labels;
use backend\models\Notes;
use backend\models\Settings;
use common\models\Helper;
use common\models\User;
use frontend\models\Favorites;
use Yii;
use yii\base\InvalidParamException;
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
class UsersController extends Controller
{

    public $layout='main';
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

    public function actionIndex(){

    }

    public function actionUserPage($id){
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $left_join='';
        $where='';
        $k=1;
        $html='';
        $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` '.$left_join.' WHERE items.id!="" '.$where.' ORDER BY `items`.`id` DESC LIMIT 8')->queryAll();
        foreach ($items as $item) {
            /*** построение ссылки ***/
            $name = \frontend\models\Items::getPropLabel($item['id'], '_name_');
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
            $this->viewPath='@app/views/catalog';
            $html .= $this->renderPartial('_catalog_item', [
                'image' => Helper::getPicture(\frontend\models\Items::getProp($item['id'], '_photo_')),
                'url' => $url,
                'name' => $name,
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_')==2?\frontend\models\Items::getPropLabel($item['id'], '_price_')*Settings::findOne(1)['value']:\frontend\models\Items::getPropLabel($item['id'], '_price_'),
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
                'date'=>strtotime($item['date_create'])
            ]);
        }
        $this->viewPath='@app/views/users';
        return $this->render('user', [
            'items'=>$html,
        ]);
    }
}
