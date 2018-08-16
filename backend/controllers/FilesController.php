<?php
namespace backend\controllers;

use backend\models\Files;
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
class FilesController extends Controller
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
                        'actions' => ['load', 'delete-files', 'show'],
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
    public function actionLoad()
    {
        $img = explode(',', str_replace(' ', '+', $_POST['tmp']));
        $img= base64_decode($img[1]);
        $fpng = fopen($_SERVER['DOCUMENT_ROOT']."/frontend/web".$_POST['folder'].$_POST['name'], "w");
        fwrite($fpng,$img);
        fclose($fpng);
        $file=new \SplFileInfo($_SERVER['DOCUMENT_ROOT']."/frontend/web".$_POST['folder'].$_POST['name']);
        $ex=$file->getExtension();
        if (!in_array($ex, Files::$image)){
            ?>
            <div class="file-box">
                <div class="file">
                    <input type="checkbox" data-name="<?= $_POST['input'] ?>" data-toggle="selectFile" data-file="<?= $_POST['folder'] ?><?= $_POST['name'] ?>">
                    <a href="#">
                        <span class="corner"></span>

                        <div class="icon">
                            <i class="fa <?= Files::$ext[$ex] ?>"></i>
                        </div>
                        <div class="file-name">
                            <?= $_POST['name'] ?>
                            <br/>
                            <small>Розмір: <?= round(($file->getSize()/1024)/1024, 2) ?> Mb</small>
                            <button class="btn btn-sm btn-danger pull-right" style="position: relative;bottom:10px" data-toggle="deleteFiles"><i class="fa fa-trash"></i> </button>
                        </div>
                    </a>
                </div>

            </div>
        <?php } else { ?>
            <div class="file-box">
                <div class="file">
                    <input type="checkbox" data-name="<?= $_POST['input'] ?>" data-toggle="selectFile" data-file="<?= $_POST['folder'] ?><?= $_POST['name'] ?>">
                    <a href="#">
                        <span class="corner"></span>

                        <div class="image">
                            <img alt="image" class="img-responsive" src="<?= $_POST['folder'] ?><?= $_POST['name'] ?>">
                        </div>
                        <div class="file-name">
                            <?= $_POST['name'] ?>
                            <br/>
                            <small>Розмір: <?= round(($file->getSize()/1024)/1024, 2) ?> Mb</small>
                            <button class="btn btn-sm btn-danger pull-right" style="position: relative;bottom:10px" data-toggle="deleteFiles"><i class="fa fa-trash"></i> </button>
                        </div>
                    </a>

                </div>
            </div>
        <?}
    }

    public function actionDeleteFiles(){
        $file=$_POST['file'];
        unlink($_SERVER['DOCUMENT_ROOT'].'/frontend/web'.$file);
    }

    public function actionShow(){
        return $this->render('show');
    }
}
