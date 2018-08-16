<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \frontend\models\SignupForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Подтверждение номера телефона';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container">
    <div class="section">
        <div class="section-title section-title-small"><span>Подтвердите номер телефона</span></div>
        <?php
        $form=ActiveForm::begin(['action'=>'/register/varification']);
        ?>
        <input type="hidden" value="<?=$id?>" name="id">
            <div class="login-container">
                <div class="login-input-row">
                    <input type="text" name="code" class="login-input" placeholder="Введите код">
                </div>
                <button class="btn btn-primary btn-login">Подтвердить</button>
            </div>
        <?php ActiveForm::end(); ?>
    </div>
</div>
