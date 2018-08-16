<?php
$this->title='Ролі';
use dosamigos\tinymce\TinyMce;
use dosamigos\datetimepicker\DateTimePicker;
use dosamigos\datepicker\DatePicker;
?>
<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <h2><?= $this->title ?></h2>
        <ol class="breadcrumb">
            <li>
                <a href="<?= Yii::$app->homeUrl ?>">Головна</a>
            </li>
            <li class="active">
                <strong><?= $this->title ?></strong>
            </li>
        </ol>
    </div>
    <div class="col-lg-2">

    </div>
</div>
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-content">
                    <?php
                    $form=\yii\bootstrap\ActiveForm::begin();

                    \yii\bootstrap\ActiveForm::end();
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>