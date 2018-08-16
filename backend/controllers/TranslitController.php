<?php
namespace backend\controllers;

use backend\models\Files;
use backend\models\Seo;
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
class TranslitController extends Controller
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
                        'actions' => ['index', 'ajax', 'load-rows'],
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
        $model=new Seo();
        if (Yii::$app->request->post()){
            $res=$model->find()->where(['part'=>$_POST['part'], 'element'=>$_POST['element']])->one();
            if (!empty($res)){
                $res->part=$_POST['part'];
                $res->element=$_POST['element'];
                $res->title=$_POST['title'];
                $res->keywords=$_POST['keywords'];
                $res->description=$_POST['description'];
                $res->save();
            } else {
                $model->part = $_POST['part'];
                $model->element = $_POST['element'];
                $model->title = $_POST['title'];
                $model->keywords = $_POST['keywords'];
                $model->description = $_POST['description'];
                if (!$model->save()) {
                    print_r($model->getErrors());
                }
            }
        }
        return $this->render('index');
    }

    public function actionLoadRows(){
        $class='\backend\models\\'.ucfirst($_POST['modul']);
        $model=new $class;
        $row=$model->rows();
        print_r($row);
    }
}
