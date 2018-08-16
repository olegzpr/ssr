<?php
namespace backend\controllers;

use backend\models\Settings;
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
class SettingsController extends Controller
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
                        'actions' => ['index', 'setting-save', 'roles'],
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
        return $this->render('settings');
    }

    public function actionSettingSave(){
        foreach ($_POST['Settings'] as $key=>$value){
            $set=Settings::findOne(['name'=>$key]);
            $set->value=$value;
            $set->save();
        }

        return Yii::$app->response->redirect('/admin/settings');
    }

    public function actionRoles(){


        return $this->render('roles');
    }
}
