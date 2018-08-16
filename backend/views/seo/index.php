<?php
$this->title='SEO модуль';
use dosamigos\tinymce\TinyMce;
use dosamigos\datetimepicker\DateTimePicker;
use dosamigos\datepicker\DatePicker; 
?>
<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <h2><?= $this->title ?></h2>
        <ol class="breadcrumb">
            <li>
                <a href="<?= Yii::$app->homeUrl ?>"><?= \backend\models\Help::Lang()->index ?></a>
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
                    ?>
                    <div class="tabs-container">
                        <ul class="nav nav-tabs">
                            <li class="active"><a data-toggle="tab" href="#tab-0" aria-expanded="true"> Основная информация</a></li>

                        </ul>
                        <div class="tab-content" style="padding-top: 20px;">
                            <div id="tab-0" class="tab-pane active">
                                <div class="panel-body">
<!--                                    <button class="btn btn-success" type="button" id="start-help">Помощь</button>-->
                                    <div class="form-group">
                                        <label class="control-label">Выберите раздел</label>
                                        <select class="form-control select2" name="part" id="change-part">
                                            <option value="">--</option>
                                            <option value="0">Главная</option>
                                            <option value="1">Услуги</option>
                                            <option value="2">Работы</option>
                                            <option value="3">Клиенты</option>
                                            <option value="4">Сотрудники</option>
                                            <option value="5">Отзывы</option>
                                            <option value="6">Рейтинги</option>
                                            <option value="7">Вакансии</option>
                                            <option value="8">Награды</option>
                                            <option value="9">Сервисы</option>
                                            <option value="10">Статьи</option>
                                            <option value="11">Об агенстве</option>
                                            <option value="12">Стажировка</option>
                                            <option value="13">Подрядчикам</option>
                                            <option value="14">Результаты поиска</option>
                                            <option value="15">Контакты</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label">Выберите элемент</label>
                                        <select class="form-control select2" name="element" id="select-element">
                                            <option value="">--</option>
                                            <option value="0">Весь раздел</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label">Title</label>
                                        <input type="text" class="form-control" name="title">
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label">Keywords</label>
                                        <input type="text" class="form-control" name="keywords">
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label">Description</label>
                                        <textarea class="form-control" rows="5" name="description"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-success" style="margin-top: 20px;"><?= \backend\models\Help::Lang()->save ?></button>
                    <?php
                    \yii\bootstrap\ActiveForm::end(); ?>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal inmodal fade" id="add-block" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form id="add-block-to-page">
                <input type="hidden" value="<?= $id ?>" name="page_id">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">Добавление блока</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Название (для вас)</label>
                    <input type="text" name="name" required class="form-control">
                </div>

                <div class="form-group">
                    <label>Код</label>
                    <textarea id="codeeditor" style="min-width: 100px;"></textarea>
                </div>

                <div id="input-to-block">
                    <div class="form-group clearfix row">
                        <div class="col-md-4">
                            <input type="text" name="input_name[]" data-toggle="generate_insert" placeholder="название поля" required class="form-control">
                        </div>
                        <div class="col-md-4">
                            <select name="input_type[]" class="form-control">
                                <option value="input">Поле ввода</option>
                                <option value="editor">Редактор</option>
                            </select>
                        </div>
                        <div class="col-md-4" data-target="code-box"></div>
                        <input type="hidden" value="" name="input_pref[]" data-target="code-input">
                    </div>
                </div>
                <div class="form-group clearfix">
                    <button class="btn btn-info" type="button" onclick="block.add();"><i class="fa fa-plus"></i></button>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-white" data-dismiss="modal">Отмена</button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
            </div>
            </form>
        </div>
    </div>
</div>