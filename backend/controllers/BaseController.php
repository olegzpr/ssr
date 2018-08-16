<?php
namespace backend\controllers;

use backend\models\Eng;
use backend\models\Help;
use backend\models\InputValue;
use backend\models\PageBlocks;
use backend\models\User;
use Yii;
use yii\db\Query;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use backend\models\News;
use lavrentiev\widgets\toastr\Notification;

/**
 * Site controller
 */
class BaseController extends Controller
{
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
                        'actions' => ['logout', 'index', 'edit', 'add', 'delete'],
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
    public function actionIndex($table)
    {
        $this->layout='main';
        $table_origin=$table;
        $table=explode('_', $table);
        if (empty($table[1])){
            $table_real=ucfirst($table[0]);
        } else {
            $table_real='';
            foreach ($table as $tab){
                $table_real.=ucfirst($tab);
            }
        }
        $class='\backend\models\\'.$table_real;
        $model=new $class();

        if (isset($_REQUEST['sort'])&&isset($_REQUEST['type'])){
            $sort=$_REQUEST['sort'].' '.$_REQUEST['type'];
        } else if (isset($_REQUEST['sort'])){
            $sort=$_REQUEST['sort'].' asc';
        } else {
            $sort='id desc';
        }

        $page=isset($_REQUEST['page'])?($_REQUEST['page']-1)*20:0;

        $where=[];
        $q=Yii::$app->request->get('q');

        if (isset($q)){
            $where[]='or';
            foreach ($model::attributeLabels() as $key=>$value) {
                $where[] = ['like', $key, $q];
            }

        }

        return $this->render('index', [
            'title'=>$model->nameTable(),
            'rows'=>$model->rows(),
            'label'=>$model->attributeLabels(),
            'data'=>$model->find()->where($where)->orderBy($sort)->offset($page)->limit(20)->all(),
            'table'=>$table_origin,
            'action'=>method_exists($model, 'actionRow')?$model->actionRow():''
        ]);
    }

    public function actionEdit($table, $id){
        $table_origin=$table;
        $table=explode('_', $table);
        if (empty($table[1])){
            $table_real=ucfirst($table[0]);
        } else {
            $table_real='';
            foreach ($table as $tab){
                $table_real.=ucfirst($tab);
            }
        }
        $class='\backend\models\\'.$table_real;
        $model=$class::findOne($id);

        if (Yii::$app->request->post()){
            if (isset($_POST['BlockInput'])){
                foreach ($_POST['BlockInput'] as $k=>$v){
                    $yes=InputValue::find()->where(['input_id'=>$k, 'element_id'=>$id])->one();
                    if (!empty($yes)){
                        if (is_array($v)){
                            $v=json_encode($v);
                        }
                        $yes->value=$v;
                        $yes->save();
                    } else {
                        $input_value = new InputValue();
                        $input_value->input_id = $k;
                        if (is_array($v)){
                            $v=json_encode($v);
                        }
                        $input_value->value = $v;
                        $input_value->element_id=$id;
                        $input_value->save();
                    }
                }
            }

            if (isset($_POST['Eng'])){
                foreach ($_POST['Eng'] as $input=>$value){
                    $eng=new Eng();
                    $eng->table=strtolower($table_real);
                    $eng->item_id=$id;
                    $eng->input=$input;
                    $eng->value=$value;
                    $eng->save();
                }
            }

            foreach ($_POST[ucfirst($table_real)] as $key=>$value){
                if (is_array($value)){
                    $tmp=[];
                    foreach ($value as $v){
                        if ($v!=''){
                            array_push($tmp, $v);
                        }
                    }
                    $model->$key = json_encode($tmp);
                } else if ($key=='data'||$key=='date'){
                    $tDate=new \DateTime($value);
                    $model->$key = $tDate->format("Y-m-d H:i:s");
                } else {
                    $model->$key = $value;
                }
            }

            if ($model->save()){
                Notification::widget([
                    'type' => 'success',
                    'title' => Help::Lang()->success,
                    'message' => Help::Lang()->success_message
                ]);
                if (!isset($_COOKIE['statusUrl'])||substr_count($_COOKIE['statusUrl'], $table_origin)<1) {
                    return Yii::$app->response->redirect('/admin/' . $table_origin);
                } else {
                    return Yii::$app->response->redirect($_COOKIE['statusUrl']);
                }
            } else {
                Notification::widget([
                    'type' => 'error',
                    'title' => Help::Lang()->error,
                    'message' => Help::Lang()->error_message
                ]);
            }
        }

        /***
         * Определение дополнительных блоков
         */
        $blocks = PageBlocks::find()->where(['and', ['or', 'page_id='.$id, 'page_id=0'], ['table'=>$table_origin]])->all();

        return $this->render('edit', [
            'title'=>Help::Lang()->edit,
            'model'=>$model,
            'rows'=>$model->rows(),
            'module'=>$model->nameTable(),
            'table'=>$table_origin,
            'id'=>$id,
            'blocks'=>$blocks,
            'label'=>$model->attributeLabels()
        ]);
    }

    public function actionAdd($table){
        $table_origin=$table;
        $table=explode('_', $table);
        if (empty($table[1])){
            $table_real=ucfirst($table[0]);
        } else {
            $table_real='';
            foreach ($table as $tab){
                $table_real.=ucfirst($tab);
            }
        }
        $class='\backend\models\\'.$table_real;
        $model=new $class();

        if (Yii::$app->request->post()){
            foreach ($_POST[ucfirst($table_real)] as $key=>$value){
                if (is_array($value)){
                    $tmp=[];
                    foreach ($value as $v){
                        if ($v!=''){
                            array_push($tmp, $v);
                        }
                    }
                    $model->$key = json_encode($tmp);
                } else if ($key=='data'||$key=='date'){
                    $tDate=new \DateTime($value);
                    $model->$key = $tDate->format("Y-m-d H:i:s");
                } else {
                    $model->$key = $value;
                }
            }

            if ($model->save()){
                $id=Yii::$app->db->lastInsertID;
                if (isset($_POST['Eng'])){
                    foreach ($_POST['Eng'] as $input=>$value){
                        $eng=new Eng();
                        $eng->table=strtolower($table_real);
                        $eng->item_id=$id;
                        $eng->input=$input;
                        $eng->value=$value;
                        $eng->save();
                    }
                }
                Notification::widget([
                    'type' => 'success',
                    'title' => Help::Lang()->success,
                    'message' => Help::Lang()->success_message
                ]);

                return Yii::$app->response->redirect('/admin/'.$table_origin);
            } else {
                Notification::widget([
                    'type' => 'error',
                    'title' => Help::Lang()->error,
                    'message' => Help::Lang()->error_message
                ]);
            }
        }

        return $this->render('edit', [
            'title'=>Help::Lang()->add,
            'model'=>$model,
            'rows'=>$model->rows(),
            'module'=>$model->nameTable(),
            'table'=>$table_origin,
            'label'=>$model->attributeLabels()
        ]);
    }

    public function actionDelete($table, $id){
        $table_origin=$table;
        $table=explode('_', $table);
        if (empty($table[1])){
            $table_real=ucfirst($table[0]);
        } else {
            $table_real='';
            foreach ($table as $tab){
                $table_real.=ucfirst($tab);
            }
        }
        $class='\backend\models\\'.$table_real;
        $model=$class::findOne($id);
        $model->delete();
    }
}
