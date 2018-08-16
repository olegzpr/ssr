<?php
$this->title='Добавить объявление';
$this->params['page']='add';
use yii\helpers\Html;
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-9 col-md-offset-3">
            <h1>Новое объявление</h1>
        </div>
    </div>
    <?php
    if (isset($error)){
        ?>
        <div class="alert alert-danger">
            <?php
            print_r($error);
            ?>
        </div>
        <?php
    }
    ?>
    <?php $form=\yii\bootstrap\ActiveForm::begin(['action'=>'/add/step', 'options'=>['class'=>'styled-form']]); ?>
    <div class="row">
        <div class="col-sm-12">
            <div id="result">
                <?
                $exit_item = \backend\models\Items::findOne(['user'=>Yii::$app->user->identity->id,'status'=>-1]);
                if (empty($exit_item)){
                    $rows = \backend\models\Rows::find()->where(['step_id' => 1])->orderBy('id')->limit(1)->all();
                } else {
                    $rows = \backend\models\Rows::find()->where(['step_id' => 1])->orderBy('id')->all();
                }
                foreach ($rows as $row) {
                    echo \common\models\Helper::rowDraw($row);
                }
                ?>
            </div>
        </div>
    </div>
    <div class="row clearfix">
        <div class="col-md-12 text-right">
            <button class="btn btn-primary">Продолжить <i class="fa fa-long-arrow-right"></i></button>
        </div>
    </div>
    <? \yii\bootstrap\ActiveForm::end() ?>
</div>