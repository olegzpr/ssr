<?php
namespace backend\controllers;

use backend\models\BlockInput;
use backend\models\GeoArea;
use backend\models\GeoCity;
use backend\models\GeoRegion;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\ItemStatus;
use backend\models\Labels;
use backend\models\PageBlocks;
use backend\models\Rows;
use backend\models\RowValues;
use backend\models\Setting;
use backend\models\User;
use common\models\Orders;
use Yii;
use yii\db\Query;
use yii\helpers\Html;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use yii\widgets\Pjax;

/**
 * Site controller
 */
class SiteController extends Controller
{
    public function beforeAction($action)
    {
        // ...set `$this->enableCsrfValidation` here based on some conditions...
        // call parent method that will check CSRF if such property is true.
        if ($action->id === 'delete-order') {
            # code...
            $this->enableCsrfValidation = false;
        }
        return parent::beforeAction($action);
    }
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'actions' => ['login', 'error'],
                        'allow' => true,
                    ],
                    [
                        'actions' => ['logout', 'index', 'delete', 'active', 'deactive', 'archive', 'generate-box', 'ledit', 'delete-order', 'setting', 'items', 'edit-item', 'more-fields', 'save-item-prop'],
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
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        $this->layout='main';
        return $this->render('index', [
            'orders'=>Orders::find()->all()
        ]);
    }

    public function actionSetting()
    {
        $pages=Setting::find()->all();
        if (Yii::$app->request->post()){
            foreach ($pages as $page){
                if (isset($_POST[$page['pref']])){
                    $model=Setting::find()->where(['pref'=>$page['pref']])->one();
                    $model->active=1;
                    $model->save();
                } else {
                    $model=Setting::find()->where(['pref'=>$page['pref']])->one();
                    $model->active=0;
                    $model->save();
                }
            }

            return Yii::$app->response->redirect(Yii::$app->request->referrer);
        }
        return $this->render('setting', [
            'pages'=>$pages
        ]);
    }

    /**
     * Login action.
     *
     * @return string
     */
    public function actionLogin()
    {

//		$user = new User();
//		$user->email = 'admin@web4u.in.ua';
//		$user->setPassword('root');
//		$user->generateAuthKey();
//		$user->username='admin';
//		$user->status=10;
//		$user->role=0;
//		$user->save();
		
        $this->layout='login';
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new \backend\models\LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        } else {
            return $this->render('login', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Logout action.
     *
     * @return string
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    public function actionDelete(){
        foreach ($_POST['id'] as $q){
            $class='\backend\models\\'.ucfirst($_POST['table']);
            $model=$class::findOne($q);
            $model->delete();
        }
    }

    public function actionActive(){
        foreach ($_POST['id'] as $q){
            $class='\backend\models\\'.ucfirst($_POST['table']);
            $model=$class::findOne($q);
            $model->status=1;
            $model->save();
        }
    }

    public function actionDeactive(){
        foreach ($_POST['id'] as $q){
            $class='\backend\models\\'.ucfirst($_POST['table']);
            $model=$class::findOne($q);
            $model->status=0;
            $model->save();
        }
    }

    public function actionArchive(){
//        foreach ($_POST['id'] as $q){
//            $class='\backend\models\\'.ucfirst($_POST['table']);
//            $model=$class::findOne($q);
//            $model->status=0;
//            $model->save();
//        }
    }

    public function actionGenerateBox(){
        $error='';
        $model=new PageBlocks();
        $model->name=$_POST['name'];
        $model->code=$_POST['code'];
        $model->page_id=$_POST['page_id'];
        if ($model->save()){
            $block_id=Yii::$app->db->getLastInsertID();
            for ($i=0;$i<count($_POST['input_name']);$i++){
                $input=new BlockInput();
                $input->name=$_POST['input_name'][$i];
                $input->pref=$_POST['input_pref'][$i];
                $input->block_id=$block_id;
                $input->type=$_POST['input_type'][$i];
                if (!$input->save()){
                    $error.=json_encode($input->getErrors());
                    return $error;
                }
            }
        } else {
            $error.=json_encode($model->getErrors());
            return $error;
        }
    }

    public function actionLedit(){
        $table_origin=$_POST['table'];
        $table=explode('_', $_POST['table']);
        if ($table[1]==''){
            $table_real=ucfirst($table[0]);
        } else {
            $table_real='';
            foreach ($table as $tab){
                $table_real.=ucfirst($tab);
            }
        }
        $class='\backend\models\\'.$table_real;
        $model=$class::findOne($_POST['id']);
        $model->$_POST['input']=$_POST['value'];
        $model->save();
    }

    public function actionDeleteOrder(){
        $order=Orders::findOne($_POST['id']);
        $order->delete();
        return Yii::$app->response->redirect('/admin/');
    }

    public function actionItems(){
        $offet = Yii::$app->request->get('page')?(Yii::$app->request->get('page')-1)*20:0;
        if (Yii::$app->request->get('q')){
            $where = '';
            if (Yii::$app->request->get('label')){
                $where.="and label='".Yii::$app->request->get('label')."'";
            }

            if (Yii::$app->request->get('status')){
                $where.="and status='".Yii::$app->request->get('status')."'";
            }

            if (Yii::$app->request->get('source')){
                $where.="and source='".Yii::$app->request->get('source')."'";
            }
            $items = Yii::$app->db->createCommand("select * from items where (id in (select item_id from item_prop where row_id='5' and value like '%".Yii::$app->request->get('q')."%') or id in (select item_id from item_prop where row_id='6' and value like '%".Yii::$app->request->get('q')."%')) ".$where." order by id desc limit 0,20")->queryAll();
        } else {
            $where = ['AND'];
            if (Yii::$app->request->get('label')){
                $where[] = ['label'=>Yii::$app->request->get('label')];
            }

            if (Yii::$app->request->get('status')){
                $where[] = ['status'=>Yii::$app->request->get('status')];
            }

            if (Yii::$app->request->get('source')){
                $where[] = ['source'=>Yii::$app->request->get('source')];
            }
            $items = Items::find()->where($where)->orderBy('id desc')->limit(20)->offset($offet)->all();
        }
        return $this->render('items', [
            'title' => 'База недвижимости',
            'items' => $items,
            'table' => 'items'
        ]);
    }

    public function actionEditItem(){
        $item = Items::findOne(Yii::$app->request->post('id'));
        ?>
        <input type="hidden" value="<?=Yii::$app->request->post('id')?>" name="id">
        <div class="row clearfix">
            <div class="col-md-4">
                <div class="form-group">
                    <label>Состояние</label>
                    <select name="status" class="form-control">
                        <?php
                        foreach (ItemStatus::find()->all() as $status){
                            ?>
                            <option <?php if ($status['id']==$item['status']) echo 'selected';?> value="<?=$status['id']?>"><?=$status['name']?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label>Метка</label>
                    <select name="label" class="form-control">
                        <?php
                        foreach (Labels::find()->all() as $label){
                            ?>
                            <option <?php if ($label['id']==$item['label']) echo 'selected';?> value="<?=$label['id']?>"><?=$label['name']?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label>Дата</label>
                    <input type="text" readonly name="date_create" value="<?=$item['date_create']?>" class="form-control">
                </div>
            </div>
        </div>

        <div class="row clearfix">
            <div class="col-md-4">
                <div class="form-group">
                    <label>Регион</label>
                    <select name="region" class="form-control">
                        <?php
                        foreach (GeoRegion::find()->all() as $status){
                            ?>
                            <option <?php if ($status['id']==$item['region']) echo 'selected';?> value="<?=$status['id']?>"><?=$status['name']?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label>Город</label>
                    <select name="city" class="form-control">
                        <?php
                        foreach (GeoCity::find()->where(['region'=>$item['region']])->all() as $label){
                            ?>
                            <option <?php if ($label['id']==$item['city']) echo 'selected';?> value="<?=$label['id']?>"><?=$label['name']?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label>Район города</label>
                    <select name="area" class="form-control">
                        <option value="0">--</option>
                        <?php
                        foreach (GeoArea::find()->where(['city'=>$item['city']])->all() as $label){
                            ?>
                            <option <?php if ($label['id']==$item['area']) echo 'selected';?> value="<?=$label['id']?>"><?=$label['name']?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <?php
            if ($item['source']!=1){
            ?>
            <div class="col-md-9">
                <div class="form-group">
                    <label>Ссылка на источник</label>
                    <section><a href="<?=$item['link']?>" target="_blank"><?=$item['link']?></a></section>
                </div>
            </div>
            <?php
            }
            ?>
            <div class="col-md-3">
                <div class="form-group">
                    <label>Показывать на главной</label>
                    <select class="form-control" name="show_index">
                        <option value="0">Нет</option>
                        <option value="1">Да</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label>Заметка</label>
                    <textarea class="form-control"><?=$item['comment']?></textarea>
                </div>
            </div>
        </div>
        <div id="mresult"><a href="javascript:void(0);" onclick="item.more(<?=$item['id']?>)">Показать больше характеристик</a></div>
        <?php
    }
    
    public function actionMoreFields(){
        $item['id'] = Yii::$app->request->post('id');
        foreach (Rows::find()->where(['not in', 'id', [32,33]])->orderBy('type')->all() as $row){
            $valueItem = ItemProp::findOne(['item_id'=>$item['id'], 'row_id'=>$row['id']])['value'];
            switch ($row['type']){
                case '1':
                    ?>
                    <div class="col-md-6">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-4 text-right">
                                    <label><?=$row['name']?></label>
                                </div>
                                <div class="col-md-8">
                                    <input name="Row[<?=$row['id']?>]" type="text" value="<?=$valueItem?>" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;

                case '8':
                    ?>
                    <div class="col-md-6">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-4 text-right">
                                    <label><?=$row['name']?></label>
                                </div>
                                <div class="col-md-8">
                                    <input name="Row[<?=$row['id']?>]" type="number" value="<?=$valueItem?>" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;

                case '4':
                    ?>
                    <div class="clearfix"></div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-3 text-right">
                                <label><?=$row['name']?></label>
                            </div>
                            <div class="col-md-9">
                                <select name="Row[<?=$row['id']?>]" class="form-control">
                                    <option value="">--</option>
                                    <?php
                                    foreach (RowValues::find()->where(['input_id'=>$row['id']])->all() as $value){
                                        ?>
                                        <option <?php if ($valueItem==$value['value']) echo 'selected'; ?> value="<?=$value['value']?>"><?=$value['label']?></option>
                                        <?php
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;

                case '2':
                    ?>
                    <div class="clearfix"></div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-3 text-right">
                                <label><?=$row['name']?></label>
                            </div>
                            <div class="col-md-9">
                                <?php
                                foreach (RowValues::find()->where(['input_id'=>$row['id']])->all() as $value){
                                    ?>
                                    <label style="margin: 0 10px 10px 0"><input type="radio" name="Row[<?=$row['id']?>]" <?php if ($valueItem==$value['value']) echo 'checked'; ?> value="<?=$value['value']?>"> <?=$value['label']?></label>
                                    <?php
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;

                case '3':
                    ?>
                    <div class="clearfix"></div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-3 text-right">
                                <label><?=$row['name']?></label>
                            </div>
                            <div class="col-md-9">
                                <?php
                                foreach (RowValues::find()->where(['input_id'=>$row['id']])->all() as $value){
                                    ?>
                                    <label style="margin: 0 10px 10px 0"><input type="checkbox" name="Row[<?=$row['id']?>]" <?php if ($valueItem==$value['value']) echo 'checked'; ?> value="<?=$value['value']?>"> <?=$value['label']?></label>
                                    <?php
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;

                case '7':
                    ?>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-3 text-right">
                                <label><?=$row['name']?></label>
                            </div>
                            <div class="col-md-9">
                                <textarea name="Row[<?=$row['id']?>]" class="form-control" rows="5"><?=$valueItem?></textarea>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;
            }
        }
        ?>
        <div class="clearfix"></div>
        <?php
    }

    public function actionSaveItemProp(){
        $model = Items::findOne(Yii::$app->request->post('id'));
        $model->status = Yii::$app->request->post('status');
        $model->label = Yii::$app->request->post('label');
        $model->region = Yii::$app->request->post('region');
        $model->city = Yii::$app->request->post('city');
        $model->area = Yii::$app->request->post('area');
        $model->show_index = Yii::$app->request->post('show_index');
        if ($model->save()){
            if (Yii::$app->request->post('Row')) {
                ItemProp::deleteAll(['item_id' => Yii::$app->request->post('id')]);
                foreach (Yii::$app->request->post('Row') as $key => $value) {
                    if (trim($value) != '') {
                        $new = new ItemProp();
                        $new->item_id = Yii::$app->request->post('id');
                        $new->row_id = $key;
                        $new->value = $value;
                        $new->value_int = (int)$value;
                        $new->save();
                    }
                }
            }

            return 'success';
        } else {
            return 'error';
        }
    }
}
