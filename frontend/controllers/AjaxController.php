<?php

namespace frontend\controllers;
use backend\models\Complains;
use backend\models\GeoArea;
use backend\models\GeoCity;
use backend\models\Locality;
use backend\models\Settings;
use common\models\Areas;
use common\models\Cities;
use frontend\models\Messages;
use yii\imagine\Image;
use backend\models\Category;
use backend\models\Contacts;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\LabelItems;
use backend\models\Labels;
use backend\models\Notes;
use backend\models\SaveFilters;
use backend\models\Steps;
use common\models\Helper;
use common\models\User;
use tpmanc\imagick\Imagick;
use Yii;
use yii\base\InvalidParamException;
use yii\db\Query;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use yii\widgets\Pjax;
use Mobizon\MobizonApi;

/**
 * Site controller
 */
class AjaxController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => [],
                'rules' => [
                    [
                        'actions' => [],
                        'allow' => true,
                        'roles' => [],
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
    public function actionSaveFilter()
    {
        $this->viewPath = '@app/views/catalog';
        $uid = Yii::$app->user->isGuest ? Yii::$app->session->hasSessionId : Yii::$app->user->identity->id;
        $session = Yii::$app->session;
        $session->open();
        if ($_POST['flag'] == 'true') {
            $_SESSION['filters'][$_POST['key']] = $_POST['val'];
        } else {
            unset($_SESSION['filters'][$_POST['key']]);
        }
        $left_join = '';
        $where = '';
        $k = 1;
        foreach ($_SESSION['filters'] as $key => $value) {
            if ($key=='region'){
                $where .= "AND region='".$value."'";
            } else if ($key=='city'){
                $where .= "AND city='".$value."'";
            } else if ($key=='srok'){
                $where .= "AND date_create>='".$value."'";
            } else {
                $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value=" . $value . ")) ";
                $k++;
            }
        }

        if (isset($_SESSION['filters_range'])) {
            foreach ($_SESSION['filters_range'] as $key => $value) {
                if ($value['min']!=0&&$value['max']!=0) {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                } else if ($value['min']!=0&&$value['max']==0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ")) ";
                } else if ($value['min']==0&&$value['max']!=0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                }
                $k++;
            }
        }
        $html = '';
        /*** -= MORE =- ***/
        $moreWhere = '';
        if (isset($_SESSION['filter_label'])){
            $moreWhere.= " AND items.id in (select item_id from label_items where label_id='".$_SESSION['filter_label']."' and user_id='".Yii::$app->user->identity->id."')";
        }

        /*** Фильтрация по маске ***/
        $filterParam = json_decode($_SESSION['GET']);
        if (isset($filterParam->filter_1)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='1' and value='".$filterParam->filter_1."')";
        }

        if (isset($filterParam->filter_2)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='2' and value='".$filterParam->filter_2."')";
        }

        if (isset($filterParam->filter_3)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='3' and value='".$filterParam->filter_3."')";
        }

        if (isset($_SESSION['hide_items'])) {
            $moreWhere .= " AND items.id  not in (" . implode(',', $_SESSION['hide_items']) . ")";
        }
        /*** END ***/

        if (isset($_SESSION['sorting'])){
            switch ($_SESSION['sorting']){
                case 'start_min_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` LIMIT 0,8')->queryAll();
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
            }
        } else {
            $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT 0,8')->queryAll();
        }

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
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_')==2?\frontend\models\Items::getPropLabel($item['id'], '_price_')*Settings::findOne(1)['value']:\frontend\models\Items::getPropLabel($item['id'], '_price_'),
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

        return $html;
    }

    public function actionSaveFilterRange()
    {
        $this->viewPath = '@app/views/catalog';
        $uid = Yii::$app->user->isGuest ? Yii::$app->session->hasSessionId : Yii::$app->user->identity->id;
        $session = Yii::$app->session;
        $session->open();
        $_SESSION['filters_range'][$_POST['key']]['min'] = $_POST['min'];
        $_SESSION['filters_range'][$_POST['key']]['max'] = $_POST['max'];
        $left_join = '';
        $where = '';
        $k = 1;
        if (isset($_SESSION['filters'])) {
            foreach ($_SESSION['filters'] as $key => $value) {
                $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value=" . $value . ")) ";
                $k++;
            }
        }
        foreach ($_SESSION['filters_range'] as $key => $value) {
            if ($value['min']!=0&&$value['max']!=0) {
                $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
            } else if ($value['min']!=0&&$value['max']==0){
                $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ")) ";
            } else if ($value['min']==0&&$value['max']!=0){
                $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
            }
            $k++;
        }
        $html = '';
        /*** -= MORE =- ***/
        $moreWhere = '';
        if (isset($_SESSION['filter_label'])){
            $moreWhere.= " AND items.id in (select item_id from label_items where label_id='".$_SESSION['filter_label']."' and user_id='".Yii::$app->user->identity->id."')";
        }

        /*** Фильтрация по маске ***/
        $filterParam = json_decode($_SESSION['GET']);
        if (isset($filterParam->filter_1)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='1' and value='".$filterParam->filter_1."')";
        }

        if (isset($filterParam->filter_2)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='2' and value='".$filterParam->filter_2."')";
        }

        if (isset($filterParam->filter_3)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='3' and value='".$filterParam->filter_3."')";
        }

        if (isset($_SESSION['hide_items'])) {
            $moreWhere .= " AND items.id  not in (" . implode(',', $_SESSION['hide_items']) . ")";
        }
        /*** END ***/

        if (isset($_SESSION['sorting'])){
            switch ($_SESSION['sorting']){
                case 'start_min_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` LIMIT 0,8')->queryAll();
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
            }
        } else {
            $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT 0,8')->queryAll();
        }

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
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_')==2?\frontend\models\Items::getPropLabel($item['id'], '_price_')*Settings::findOne(1)['value']:\frontend\models\Items::getPropLabel($item['id'], '_price_'),
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

        return $html;
    }

    public function actionSorting()
    {
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $session = Yii::$app->session;
        $session->open();
        $_SESSION['sorting'] = $_POST['type'];
        $left_join = '';
        $where = '';
        $k = 1;
        if (isset($_SESSION['filters'])) {
            foreach ($_SESSION['filters'] as $key => $value) {
                if ($key=='region'){
                    $where .= "AND region='".$value."'";
                } else if ($key=='city'){
                    $where .= "AND city='".$value."'";
                } else if ($key=='srok'){
                    $where .= "AND date_create>='".$value."'";
                } else {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value=" . $value . ")) ";
                    $k++;
                }
            }
        }
        if (isset($_SESSION['filters_range'])) {
            foreach ($_SESSION['filters_range'] as $key => $value) {
                if ($value['min']!=0&&$value['max']!=0) {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                } else if ($value['min']!=0&&$value['max']==0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ")) ";
                } else if ($value['min']==0&&$value['max']!=0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
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
        $filterParam = json_decode($_SESSION['GET']);
        if (isset($filterParam->filter_1)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='1' and value='".$filterParam->filter_1."')";
        }

        if (isset($filterParam->filter_2)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='2' and value='".$filterParam->filter_2."')";
        }

        if (isset($filterParam->filter_3)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='3' and value='".$filterParam->filter_3."')";
        }

        if (isset($_SESSION['hide_items'])) {
            $moreWhere .= " AND items.id  not in (" . implode(',', $_SESSION['hide_items']) . ")";
        }
        /*** END ***/

        switch ($_POST['type']){
            case 'start_min_price':
                $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` LIMIT 0,8')->queryAll();
                break;

            case 'start_max_price':
                $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` DESC LIMIT 0,8')->queryAll();
                break;

            case 'in_photo':
                $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.status="1" ' . $where . $moreWhere . ' ORDER BY `items`.`id` limit 0,8')->queryAll();
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
                break;

            case 'start_old':
                $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.status="1" ' . $where . $moreWhere . ' ORDER BY `items`.`date_create` limit 0,8')->queryAll();
                break;

            case 'start_new':
                $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.status="1" ' . $where . $moreWhere . ' ORDER BY `items`.`date_create` DESC limit 0,8')->queryAll();
                break;
        }

        $html = '';
        foreach ($items as $pr) {
            $item = Items::findOne($pr['id']);
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
            $this->viewPath = '@app/views/catalog';
            $html .= $this->renderPartial('_catalog_item', [
                'image' => Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_')),
                'url' => $url,
                'name' => $name,
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_')==2?\frontend\models\Items::getPropLabel($item['id'], '_price_')*Settings::findOne(1)['value']:\frontend\models\Items::getPropLabel($item['id'], '_price_'),
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
        return $html;
    }

    public function actionFilterLabel()
    {
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $session = Yii::$app->session;
        $session->open();
        if ($_POST['label']==0){
            unset($_SESSION['filter_label']);
        } else {
            $_SESSION['filter_label'] = $_POST['label'];
        }
        $left_join = '';
        $where = '';
        $k = 1;

        /*** -= Формирование фильтров =- ***/
        if (isset($_SESSION['filters'])) {
            foreach ($_SESSION['filters'] as $key => $value) {
                if ($key=='region'){
                    $where .= "AND region='".$value."'";
                } else if ($key=='city'){
                    $where .= "AND city='".$value."'";
                } else if ($key=='srok'){
                    $where .= "AND date_create>='".$value."'";
                } else {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value=" . $value . ")) ";
                    $k++;
                }
            }
        }
        if (isset($_SESSION['filters_range'])) {
            foreach ($_SESSION['filters_range'] as $key => $value) {
                if ($value['min']!=0&&$value['max']!=0) {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                } else if ($value['min']!=0&&$value['max']==0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ")) ";
                } else if ($value['min']==0&&$value['max']!=0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                }
                $k++;
            }
        }
        /*** -= END =- ***/

        /*** -= MORE =- ***/
        $moreWhere = '';
        if (isset($_SESSION['filter_label'])){
            $moreWhere.= " AND items.id in (select item_id from label_items where label_id='".$_SESSION['filter_label']."' and user_id='".Yii::$app->user->identity->id."')";
        }

        /*** Фильтрация по маске ***/
        $filterParam = json_decode($_SESSION['GET']);
        if (isset($filterParam->filter_1)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='1' and value='".$filterParam->filter_1."')";
        }

        if (isset($filterParam->filter_2)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='2' and value='".$filterParam->filter_2."')";
        }

        if (isset($filterParam->filter_3)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='3' and value='".$filterParam->filter_3."')";
        }

        if (isset($_SESSION['hide_items'])) {
            $moreWhere .= " AND items.id  not in (" . implode(',', $_SESSION['hide_items']) . ")";
        }
        /*** END ***/

        if (isset($_SESSION['sorting'])){
            switch ($_SESSION['sorting']){
                case 'start_min_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` LIMIT 0,8')->queryAll();
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
            }
        } else {
            $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT 0,8')->queryAll();
        }

        $html = '';
        foreach ($items as $pr) {
            $item = Items::findOne($pr['id']);
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
            $this->viewPath = '@app/views/catalog';
            $html .= $this->renderPartial('_catalog_item', [
                'image' => Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_')),
                'url' => $url,
                'name' => $name,
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_')==2?\frontend\models\Items::getPropLabel($item['id'], '_price_')*Settings::findOne(1)['value']:\frontend\models\Items::getPropLabel($item['id'], '_price_'),
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
        return $html;
    }

    public function actionDialog()
    {
        $user = $_POST['sender'];
        $res = \Yii::$app->db->createCommand("select * from messages where (to_user='" . \Yii::$app->user->identity->username . "' and from_user='" . $user . "') or (from_user='" . \Yii::$app->user->identity->username . "' and to_user='" . $user . "') order by id")->queryAll();
        foreach ($res as $row) {
            $date = new \DateTime($row['data']);
            if ($row['from_user'] == Yii::$app->user->identity->username) {
                $class = 'i-message';
            } else {
                $class = 'you-message';
                $model = Messages::findOne($row['id']);
                $model->status = 1;
                $model->save();
            }
            ?>
            <div class="<?=$class?>">
                <span><?=$row['text']?> <i><?=$date->format('H:i')?></i></span>
            </div>
            <?php
        }
    }

    public function actionMore()
    {
        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
        $session = Yii::$app->session;
        $session->open();
        $left_join = '';
        $where = '';
        $k = 1;
        if (isset($_SESSION['filters'])) {
            foreach ($_SESSION['filters'] as $key => $value) {
                if ($key=='region'){
                    $where .= "AND region='".$value."'";
                } else if ($key=='city'){
                    $where .= "AND city='".$value."'";
                } else if ($key=='srok'){
                    $where .= "AND date_create>='".$value."'";
                } else {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value=" . $value . ")) ";
                    $k++;
                }
            }
        }
        if (isset($_SESSION['filters_range'])) {
            foreach ($_SESSION['filters_range'] as $key => $value) {
                if ($value['min']!=0&&$value['max']!=0) {
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
                } else if ($value['min']!=0&&$value['max']==0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value>=" . $value['min'] . ")) ";
                } else if ($value['min']==0&&$value['max']!=0){
                    $left_join .= "LEFT JOIN `item_prop` as `prop_" . $k . "` ON (`prop_" . $k . "`.`item_id` = `items`.`id`) ";
                    $where .= "AND ((prop_" . $k . ".row_id=" . $key . ") AND (prop_" . $k . ".value<=" . $value['max'] . ")) ";
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
        $filterParam = json_decode($_SESSION['GET']);
        if (isset($filterParam->filter_1)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='1' and value='".$filterParam->filter_1."')";
        }

        if (isset($filterParam->filter_2)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='2' and value='".$filterParam->filter_2."')";
        }

        if (isset($filterParam->filter_3)){
            $moreWhere.= " AND items.id in (select item_id from item_prop where row_id='3' and value='".$filterParam->filter_3."')";
        }

        if (isset($_SESSION['hide_items'])) {
            $moreWhere .= " AND items.id  not in (" . implode(',', $_SESSION['hide_items']) . ")";
        }
        /*** END ***/
        if (isset($_SESSION['sorting'])){
            switch ($_SESSION['sorting']){
                case 'start_min_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` LIMIT '.$_POST['limit'].',8')->queryAll();
                    break;

                case 'start_max_price':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` LEFT JOIN `item_prop` as `prop_prices` ON (`prop_prices`.`item_id` = `items`.`id` and `prop_prices`.`row_id` = 24) ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `prop_prices`.`value_int` DESC LIMIT '.$_POST['limit'].',8')->queryAll();
                    break;

                case 'in_photo':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT '.$_POST['limit'].',8')->queryAll();
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
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`date_create` LIMIT '.$_POST['limit'].',8')->queryAll();
                    break;

                case 'start_new':
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`date_create` DESC LIMIT '.$_POST['limit'].',8')->queryAll();
                    break;

                default:
                    $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT '.$_POST['limit'].',8')->queryAll();
                    break;
            }
        } else {
            $items = Yii::$app->db->createCommand('SELECT `items`.* FROM `items` ' . $left_join . ' WHERE items.id!="" ' . $where . $moreWhere . ' ORDER BY `items`.`id` DESC LIMIT '.$_POST['limit'].',8')->queryAll();
        }

        $html = '';
        foreach ($items as $pr) {
            $item = Items::findOne($pr['id']);
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
            $this->viewPath = '@app/views/catalog';
            $html .= $this->renderPartial('_catalog_item', [
                'image' => Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_')),
                'url' => $url,
                'name' => $name,
                'price' => \frontend\models\Items::getPropLabel($item['id'], '_currency_')==2?\frontend\models\Items::getPropLabel($item['id'], '_price_')*Settings::findOne(1)['value']:\frontend\models\Items::getPropLabel($item['id'], '_price_'),
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

        return $html;
    }

    /*** TODO загрузка полів ***/
    public function actionLoadRows()
    {
        $row = \backend\models\Rows::find()->where(['step_id' => 1, 'sub' => $_POST['id']])->orderBy('id')->one();
        echo Helper::rowDraw($row, Yii::$app->request->post('value'));
    }

    public function actionLoadSteps()
    {
        ?>
        <div class="btn-group" role="group">
            <?php
            $steps = Steps::find()->where(['mask' => $_POST['mask']])->all();
            $s = 1;
            foreach ($steps as $step) {
                ?>
                <button type="button" class="btn <?php if ($s == 1) {
                    echo 'btn-success';
                } else {
                    echo 'btn-secondary';
                } ?>"><?php echo $step['name'] ?></button>
                <?
                $s++;
            }
            ?>
        </div>
        <?php
        $offset = isset($_POST['next']) ? $_POST['next'] : 0;
        $step = Steps::find()->where(['mask' => $_POST['mask']])->orderBy('id')->offset($offset)->one();
        $step_next = Steps::find()->where(['mask' => $_POST['mask']])->orderBy('id')->offset($offset + 1)->one();
        if (!empty($step_next)) {
            ?>
            <div class="row">
                <div class="col-sm-12">
                    <?php
                    $rows = \backend\models\Rows::find()->where(['step_id' => $step['id']])->all();
                    foreach ($rows as $row) {
                        echo Helper::rowDraw($row);
                    }
                    ?>
                    <div class="text-center">
                        <button class="btn btn-primary" data-toggle="next-step" type="button"
                                data-next="<?= $offset + 1 ?>">Дальше
                        </button>
                    </div>
                </div>
            </div>
            <?
        }
    }

    public function actionLoadStepsNext()
    {
        $next = Yii::$app->request->post('next');
        if ($next == 1) {
            if (Yii::$app->user->isGuest) {
                $id_name = \frontend\models\Items::getIdRow('_username_');
                $id_phone = \frontend\models\Items::getIdRow('_phone_');
                $exitUser = User::findOne(['username'=>Yii::$app->request->post('inp')[$id_phone]]);
                if (empty($exitUser)) {
                    $user = new User();
                    $user->username = Yii::$app->request->post('inp')[$id_phone];
                    $user->name = Yii::$app->request->post('inp')[$id_name];
                    $pass = Helper::generatePassword();
                    $user->setPassword($pass);
                    $user->generateAuthKey();
                    $user->status = 10;
                    if ($user->save()) {
                        $api = new MobizonApi('91f8cd3cd111673fd8c80b6276baac2fe527f179');
                        $api->call('message',
                            'sendSMSMessage',
                            array(
                                'recipient' => Yii::$app->request->post('inp')[$id_phone],
                                'text' => 'Ваш пароль для входа - ' . $pass
                            ));
                        $now_user = Yii::$app->db->getLastInsertID();
                    }
                } else {
                    $now_user = $exitUser['id'];
                }
            } else {
                $now_user=Yii::$app->user->identity->id;
            }
            $item=new Items();
            $item->date_create=date("Y-m-d H:i:s");
            $item->user=$now_user;
            $item->status=0;
            if ($item->save()){
                $max=Yii::$app->db->getLastInsertID();
                Yii::$app->session->setFlash('add_active_item_id', $max);
                foreach (Yii::$app->request->post('inp') as $key=>$value){
                    if ($key>0){
                        $itemProp=new ItemProp();
                        $itemProp->item_id=$max;
                        $itemProp->row_id=$key;
                        if (is_array($value)){
                            $value=json_encode($value);
                        }
                        $itemProp->value=$value;
                        $itemProp->value_int=(int)$value;
                        $itemProp->save();
                    }
                }
            }
        } else {
            $max=Yii::$app->session->getFlash('add_active_item_id');
            foreach (Yii::$app->request->post('inp') as $key=>$value){
                if ($key>0){
                    $itemProp=new ItemProp();
                    $itemProp->item_id=$max;
                    $itemProp->row_id=$key;
                    if (is_array($value)){
                        $value=json_encode($value);
                    }
                    $itemProp->value=$value;
                    $itemProp->value_int=(int)$value;
                    $itemProp->save();
                }
            }
        }
        ?>
        <div class="btn-group" role="group">
            <?php
            $steps = Steps::find()->where(['mask' => $_POST['mask']])->all();
            $s = 1;
            foreach ($steps as $step) {
                ?>
                <button type="button" class="btn <?php if ($s == $next+1) {
                    echo 'btn-success';
                } else {
                    echo 'btn-secondary';
                } ?>"><?php echo $step['name'] ?></button>
                <?
                $s++;
            }
            ?>
        </div>
        <?php
        $step = Steps::find()->where(['mask' => $_POST['mask']])->orderBy('id')->offset($_POST['next'])->one();
        $step_next = Steps::find()->where(['mask' => $_POST['mask']])->orderBy('id')->offset($_POST['next'] + 1)->one();
        if (!empty($step_next)) {
            ?>
            <div class="row">
                <div class="col-sm-12">
                    <?php
                    $rows = \backend\models\Rows::find()->where(['step_id' => $step['id']])->all();
                    foreach ($rows as $row) {
                        echo Helper::rowDraw($row);
                    }
                    ?>
                    <div class="text-center">
                        <?php if ($next>1){ ?>
                            <button class="btn btn-primary" data-toggle="next-step" type="button" data-next="<?php echo $next-1 ?>">Назад</button>
                        <?php } ?>
                        <button class="btn btn-primary" data-toggle="next-step" type="button" data-next="<?= $_POST['next'] + 1 ?>">Дальше</button>
                    </div>
                </div>
            </div>
            <?
        } else {
            ?>
            <div class="row">
                <div class="col-sm-12">
                    <?php
                    $rows = \backend\models\Rows::find()->where(['step_id' => $step['id']])->all();
                    foreach ($rows as $row) {
                        echo Helper::rowDraw($row);
                    }
                    ?>
                    <div class="text-center">
                        <button type="button" class="btn btn-primary" data-toggle="final-step">Сохранить</button>
                    </div>
                </div>
            </div>
            <?
        }
    }

    public function actionSaveFinal(){
        $max=Yii::$app->session->getFlash('add_active_item_id');
        foreach (Yii::$app->request->post('inp') as $key=>$value){
            if ($key>0){
                $itemProp=new ItemProp();
                $itemProp->item_id=$max;
                $itemProp->row_id=$key;
                if (is_array($value)){
                    $value=json_encode($value);
                }
                $itemProp->value=$value;
                $itemProp->value_int=(int)$value;
                $itemProp->save();
            }
        }
    }

    /**
     * Add note
     */
    public function actionSaveNote()
    {
        $item_id = $_POST['id'];
        $text = $_POST['text'];
        $user_id = Yii::$app->user->identity->id;
        $note = new Notes();
        $note->item_id = $item_id;
        $note->user_id = $user_id;
        $note->text = $text;
        if ($note->save()) {
            return true;
        } else {
            return json_encode($note->getErrors());
        }
    }

    public function actionShowNote()
    {
        $note = Notes::find()->where(['item_id' => $_POST['id'], 'user_id' => Yii::$app->user->identity->id])->one();
        return $note['text'];
    }

    public function actionEditNote()
    {
        $model = Notes::find()->where(['item_id' => $_POST['id'], 'user_id' => Yii::$app->user->identity->id])->one();
        $model->text = $_POST['text'];
        if ($model->save()) {
            return true;
        } else {
            return json_encode($model->getErrors());
        }
    }

    public function actionSaveUserFilter()
    {
        $uid = Yii::$app->user->isGuest ? Yii::$app->session->hasSessionId : Yii::$app->user->identity->id;
        Yii::$app->session->open();
        $model = new SaveFilters();
        $model->user_id = $uid;
        $model->name = $_POST['name'];
        $text = '';
        $text2 = '';
        if (isset($_SESSION['filters'])) {
            $text = json_encode($_SESSION['filters']);
        }
        if (isset($_SESSION['filters_range'])) {
            $text2 = json_encode($_SESSION['filters_range']);
        }
        $codes = ['filter'=>$text, 'filter_range' => $text2];
        $model->text = json_encode($codes);
        if ($model->save()) {
            return true;
        } else {
            return json_encode($model->getErrors());
        }
    }

    public function actionSaveLabel()
    {
        $item_id = $_POST['item_id'];
        $label_id = $_POST['label_id'];
        $uid = Yii::$app->user->isGuest ? Yii::$app->session->hasSessionId : Yii::$app->user->identity->id;
        $label = LabelItems::find()->where(['item_id' => $item_id, 'label_id' => $label_id, 'user_id' => $uid])->one();
        if (empty($label)) {
            $model = new LabelItems();
            $model->item_id = $item_id;
            $model->label_id = $label_id;
            $model->user_id = $uid;
            $model->save();
        } else {
            $label->label_id = $label_id;
            $label->save();
        }
    }

    public function actionLoadImage()
    {
        $img = explode(',', str_replace(' ', '+', $_POST['tmp']));
        $img= base64_decode($img[1]);
        $name=$_POST['name'].'_'.md5(date("YmdHis"));
        $img = explode(',', str_replace(' ', '+', $_POST['tmp']));
//echo $img[1];
        $img= base64_decode($img[1]);
        $ext=explode('.', $_POST['name']);
        $ext=array_pop($ext);
        $fpng = fopen($_SERVER['DOCUMENT_ROOT'].'/frontend/web'.$_POST['folder'].$name.".".$ext, "w");
        fwrite($fpng,$img);
        fclose($fpng);
        return $_POST['folder'].$name.'.'.$ext;

    }

    public function actionSaveContact(){
        Contacts::deleteAll(['user'=>Yii::$app->user->identity->id]);
        foreach (Yii::$app->request->post('phones') as $phone){
            $contact = new Contacts();
            $contact->user = Yii::$app->user->identity->id;
            $contact->type = 1;
            $contact->value = $phone['number'];
            if (isset($phone['apps'])) {
                $contact->params = json_encode($phone['apps']);
            } else {
                $contact->params = '';
            }
            $contact->save();
        }
        foreach (Yii::$app->request->post('emails') as $email){
            $contact = new Contacts();
            $contact->user = Yii::$app->user->identity->id;
            $contact->type = 2;
            $contact->value = $email['email'];
            $contact->params = $email['allow'];
            $contact->save();
        }
        foreach (Yii::$app->request->post('socs') as $soc){
            $contact = new Contacts();
            $contact->user = Yii::$app->user->identity->id;
            $contact->type = 3;
            $contact->value = $soc['link'];
            $contact->params = json_encode(['allow'=>$soc['allow'], 'name'=>$soc['name']]);
            $contact->save();
        }
    }

    public function actionImageRotate(){
        $img = Image::frame('../web'.Yii::$app->request->post('image'), 0);
        $img->rotate(90)->save('../web'.Yii::$app->request->post('image'), ['jpeg_quality' => 100]);
        return Yii::$app->request->post('image');
    }

    public function actionCityList(){
        ?>
        <option>Город</option>
        <?php
        $rayons = GeoCity::find()->where(['region'=>Yii::$app->request->post('region')])->orderBy('name')->distinct('name')->all();
        foreach ($rayons as $rayon) {
            ?>
            <option value="<?= $rayon['id'] ?>"><?= $rayon['name'] ?></option>
            <?php
        }
    }

    public function actionAreaList(){
        $areas = GeoArea::find()->where(['city'=>Yii::$app->request->post('city')])->orderBy('name')->all();
        foreach ($areas as $area) {
            ?>
            <option value="<?= $area['id'] ?>"><?= $area['name'] ?></option>
            <?php
        }
    }

    public function actionChangeCurrency(){
        Yii::$app->session->set('currencySite', Yii::$app->request->post());
        return true;
    }

    public function actionHideInCatalog(){
        $_SESSION['hide_items'][] = Yii::$app->request->post('id');
    }

    public function actionSaveComplain(){
        $model = new Complains();
        $model->uid = Yii::$app->user->identity->id;
        $model->item = Yii::$app->request->post('id');
        $model->text = Yii::$app->request->post('text');
        if ($model->save()){
            echo 'success';
        } else {
            echo 'error';
        }
    }
}
