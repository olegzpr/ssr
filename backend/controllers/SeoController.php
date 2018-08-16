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
class SeoController extends Controller
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
                        'actions' => ['index', 'ajax'],
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

    public function actionAjax(){
        if ($_POST['flag']=='part') {
            $table = [
                1 => 'Services',
                2 => 'Works',
                3 => 'Clients',
                4 => 'Employees',
                5 => 'Reviews',
                6 => 'Rating',
                7 => 'Vacancies',
                8 => 'Awards',
                9 => 'App',
                10 => 'Articles',
            ];

            $class = '\backend\models\\' . $table[$_POST['part']];
            $model = $class::find()->all();
            foreach ($model as $row) {
                if ($_POST['part'] == 4) {
                    ?>
                    <option value="<?= $row['id'] ?>"><?= $row['fio'] ?></option>
                    <?
                } else {
                    ?>
                    <option value="<?= $row['id'] ?>"><?= $row['name'] ?></option>
                    <?
                }
            }
        } else if ($_POST['flag']=='info'){
            $info=Seo::find()->where(['part'=>$_POST['part'], 'element'=>$_POST['element']])->one();
            return json_encode(['title'=>$info['title'], 'desc'=>$info['description'], 'keywords'=>$info['keywords']]);
        }
    }
}
