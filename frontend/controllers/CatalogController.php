<?php
namespace frontend\controllers;

use backend\models\Category;
use backend\models\GeoCity;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\LabelItems;
use backend\models\Labels;
use backend\models\Notes;
use backend\models\SaveFilters;
use backend\models\Settings;
use backend\models\Steps;
use common\models\Helper;
use Yii;
use yii\base\InvalidParamException;
use yii\helpers\Url;
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
class CatalogController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['catalog'],
                'rules' => [
                    [
                        'actions' => ['catalog'],
                        'allow' => true,
                        'roles' => ['?','@'],
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

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionCatalog()
    {
        if (isset($_GET['city'])){
            $region = GeoCity::findOne($_GET['city']);
            $_SESSION['filters']['region'] = $region['region'];
            $_SESSION['filters']['city'] = $_GET['city'];
        }
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $left_join='';
        $where='';
        $k=1;
        $html='';
        if (isset($_SESSION['filters'])) {
            foreach ($_SESSION['filters'] as $key => $value) {
                if ($key=='region'){
                    $where .= " AND region='".$value."'";
                } else if ($key=='city'){
                    $where .= " AND city='".$value."'";
                } else if ($key=='srok'){
                    $where .= " AND date_create>='".$value."'";
                } else {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= " AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value=" . $value . ")) ";
                    $k++;
                }
            }
        }
        if (isset($_SESSION['filters_range'])) {
            foreach ($_SESSION['filters_range'] as $key => $value) {
                if ($value['min']!=0&&$value['max']!=0) {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= " AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                } else if ($value['min']!=0&&$value['max']==0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= " AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ")) ";
                } else if ($value['min']==0&&$value['max']!=0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= " AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                }
                $k++;
            }
        }
        /*** -= MORE =- ***/
        $moreWhere = '';
        if (isset($_SESSION['filter_label'])){
            $moreWhere.= " AND items.id in (select item_id from label_items where label_id='".$_SESSION['filter_label']."' and user_id='".Yii::$app->user->identity->id."')";
        }

        /*** Фильтрация по маске ***/
        if (Yii::$app->request->get('filter_1')){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='1' and value='".Yii::$app->request->get('filter_1')."')";
        }

        if (Yii::$app->request->get('filter_2')){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='2' and value='".Yii::$app->request->get('filter_2')."')";
        }

        if (Yii::$app->request->get('filter_3')){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='3' and value='".Yii::$app->request->get('filter_3')."')";
        }

        if (isset($_SESSION['hide_items'])) {
            $moreWhere .= " AND items.id  not in (" . implode(',', $_SESSION['hide_items']) . ")";
        }
        /*** END ***/

        if (isset($_SESSION['sorting'])){
            switch ($_SESSION['sorting']){
                case 'start_min_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` INNER JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` LIMIT 0,8')->queryAll();
                    break;

                case 'start_max_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` DESC LIMIT 0,8')->queryAll();
                    break;

                case 'in_photo':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT 0,8')->queryAll();
                    $yes = [];
                    $not = [];
                    foreach ($items as $item) {
                        $photo = \frontend\models\Items::getPropLabel($item['id'], '_photo_');
                        if (empty($photo)){
                            $not[] = ['id' => $item['id']];
                        } else {
                            $yes[] = ['id' => $item['id']];
                        }
                    }
                    $items = array_merge($yes, $not);
                    $itms = [];
                    foreach ($items as $item){
                        $itms[] = $item['id'];
                    }
                    $items = Items::find()->where(['IN', 'id', $itms])->all();
                    break;

                case 'start_old':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`date_create` LIMIT 0,8')->queryAll();
                    break;

                case 'start_new':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`date_create` DESC LIMIT 0,8')->queryAll();
                    break;

                default:
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.status="2" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT 0,8')->queryAll();
                    break;
            }
        } else {
            $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.status="2" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT 0,8')->queryAll();
        }

        if (isset($_GET['view'])&&$_GET['view']=='map'){
            $points=[];
            foreach ($items as $item){
                $points[]=['id'=>$item['id'], 'address'=>\frontend\models\Items::getPropLabel($item['id'], '_name_')];
            }
            return $this->render('catalog', [
                'items' =>$points,
                'nabor_filters' => SaveFilters::find()->where(['user_id' => $uid])->all()
            ]);
        } else {
            foreach ($items as $item) {
                /*** построение ссылки ***/
                $name = Helper::titleFormat($item['id']);
                //$category = \frontend\models\Category::findOne($item['category']);
                $url = '/catalog/' . \common\models\Helper::str2url($name) . '-' . $item['id'];

                /*** формирование времени подачи объявления ***/
                $date = strtotime($item['date_create']);
                $now = strtotime(date("Y-m-d H:i:s"));
                $diff = $now-$date;
                $item_add_date = '';
                if ($diff<60) {
                    $item_add_date = 'Добавлено: ' . $diff . ' c. назад';
                } else if ($diff<3600) {
                    $item_add_date = 'Добавлено: ' . round(($diff/60),0) . ' м. назад';
                } else if ($diff<86400) {
                    $item_add_date = 'Добавлено: ' . round(($diff/3600),0) . ' ч. назад';
                } else {
                    $item_add_date = 'Добавлено: ' . round(($diff/86400), 0) . ' д. назад';
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
                    $label_icon = '<i class="fa fa-bookmark-o"></i>';
                }
  
                $html .= $this->renderPartial('_catalog_item', [
                    'image' => Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_')),
                    'url' => $url,
                    'name' => $name,
                    'price' => \frontend\models\Items::getPrice($item['id']),
                    'phone' => \frontend\models\Items::getPropLabel($item['id'], '_phone_'),
                    'place' => \frontend\models\Items::getPropLabel($item['id'], '_place_'),
                    'etag' => \frontend\models\Items::getPropLabel($item['id'], '_etag_'),
                    'desc' => \common\models\Helper::getShortText(\frontend\models\Items::getPropLabel($item['id'], '_desc_'), 100),
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
            return $this->render('catalog', [
                'items' => $html,
                'nabor_filters' => SaveFilters::find()->where(['user_id' => $uid])->all()
            ]);
        }
    }

    public function actionItem($pref){
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $tmp=explode('-', $pref);
        $id=array_pop($tmp);
        $model=Items::findOne($id);

        /*** Перевірка на наявність мітки***/
        $label=LabelItems::find()->where(['item_id'=>$id, 'user_id'=>$uid])->one();
        if (!empty($label)){
            $label_class='active';
            $label_info=Labels::findOne($label['label_id']);
            $label_icon='<i class="fa '.$label_info['icon'].'"></i>';
        } else {
            $label_class='';
            $label_icon='<i class="fa fa-bookmark-o"></i>';
        }

        /*** Перевірка на наявність замітки***/
        $note=Notes::findOne(['user_id'=>$uid, 'item_id'=>$id]);
        if (!empty($note)){
            $note_class='Есть заметка';
            $note_action='open-edit-modal-note';
        } else {
            $note_class='Написать заметку';
            $note_action='open-modal-note';
        }

        $mask='';
        $vals=ItemProp::find()->where(['and', ['item_id'=>$id], ['in','row_id', [1,2,3]]])->all();
        foreach ($vals as $val){
            $mask.=$val['value'];
        }
        return $this->render('item', [
            'model'=>$model,
            'label'=>[
                'class'=>$label_class,
                'icon'=>$label_icon
            ],
            'steps'=>Steps::find()->where(['mask'=>$mask, 'show_item'=>1])->all(),
            'username'=>\frontend\models\Items::getPropLabel($id, '_username_'),
            'phone'=>\frontend\models\Items::getPropLabel($id, '_phone_'),
            'note'=>[
                'action'=>$note_action,
                'label'=>$note_class
            ]
        ]);
    }

    public function actionMapItem(){
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $id=$_POST['id'];
        $model=Items::findOne($id);

        /*** Перевірка на наявність мітки***/
        $label=LabelItems::find()->where(['item_id'=>$id, 'user_id'=>$uid])->one();
        if (!empty($label)){
            $label_class='active';
            $label_info=Labels::findOne($label['label_id']);
            $label_icon='<i class="fa '.$label_info['icon'].'"></i>';
        } else {
            $label_class='';
            $label_icon='<span></span><span></span><span></span>';
        }

        /*** Перевірка на наявність замітки***/
        $note=Notes::findOne(['user_id'=>$uid, 'item_id'=>$id]);
        if (!empty($note)){
            $note_class='Есть заметка';
            $note_action='open-edit-modal-note';
        } else {
            $note_class='Написать заметку';
            $note_action='open-modal-note';
        }

        $mask='';
        $vals=ItemProp::find()->where(['and', ['item_id'=>$id], ['in','row_id', [1,2,3]]])->all();
        foreach ($vals as $val){
            $mask.=$val['value'];
        }
        return $this->renderPartial('item', [
            'model'=>$model,
            'label'=>[
                'class'=>$label_class,
                'icon'=>$label_icon
            ],
            'steps'=>Steps::find()->where(['mask'=>$mask, 'show_item'=>1])->all(),
            'username'=>\frontend\models\Items::getPropLabel($id, '_username_'),
            'phone'=>\frontend\models\Items::getPropLabel($id, '_phone_'),
            'note'=>[
                'action'=>$note_action,
                'label'=>$note_class
            ]
        ]);
    }

    /**
     * Очистка фильтров
     */
    public function actionResetFilter(){
        Yii::$app->session->open();
        if (isset($_SESSION['filters'])) {
            foreach ($_SESSION['filters'] as $key => $value) {
                echo $key;
                unset($_SESSION['filters'][$key]);
            }
        }
        if (isset($_SESSION['filters_range'])) {
            foreach ($_SESSION['filters_range'] as $key => $value) {
                echo $key;
                unset($_SESSION['filters_range'][$key]);
            }
        }

        if (isset($_SESSION['filter_label'])){
            unset($_SESSION['filter_label']);
        }

        return $this->redirect(Yii::$app->request->referrer);
    }
}
