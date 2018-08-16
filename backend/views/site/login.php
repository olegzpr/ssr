<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Вход';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="loginColumns animated fadeInDown">
    <div class="row">

        <div class="col-md-6">
            <h2 class="font-bold">Добро пожаловать</h2>
        </div>
        <div class="col-md-6">
            <div class="ibox-content">
                <?php $form = ActiveForm::begin(['id' => 'login-form', 'options'=>['class'=>'m-t']]); ?>
                <?= $form->field($model, 'username')->textInput(['autofocus' => true]) ?>
                <?= $form->field($model, 'password')->passwordInput() ?>
                <?= $form->field($model, 'rememberMe')->checkbox() ?>
                    <button type="submit" class="btn btn-primary block full-width m-b">Войти</button>
                <?php ActiveForm::end(); ?>
                <p class="m-t">
                    <small>&copy; 2016-<?=date("Y") ?></small>
                </p>
            </div>
        </div>
    </div>
    <hr/>
    <div class="row">
        <div class="col-md-6">

        </div>
        <div class="col-md-6 text-right">
            <small>© 2016-<?=date("Y") ?></small>
        </div>
    </div>
</div>
