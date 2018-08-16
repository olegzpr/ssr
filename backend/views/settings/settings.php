<?php
$this->title='Налаштування';
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
                <strong>Налаштування</strong>
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
                    <form action="/admin/setting-save" method="post" class="form-horizontal">
                        <?php
                        $res=\backend\models\Settings::find()->all();
                        foreach ($res as $row){
                        ?>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><?= $row['title'] ?></label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="Settings[<?= $row['name'] ?>]" value="<?= $row['value'] ?>">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <?php } ?>
                        <div class="form-group">
                            <div class="col-sm-4 col-sm-offset-2">
                                <button class="btn btn-primary" type="submit">Зберегти</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>