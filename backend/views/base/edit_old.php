<?php
$this->title=$title;
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
            <li>
                <a href="<?= Yii::$app->homeUrl ?>/<?= $table ?>"><?= $module ?></a>
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
                            <?php
                            foreach ($blocks as $block){
                            ?>
                            <li class=""><a data-toggle="tab" href="#tab-<?= $block['id'] ?>" aria-expanded="false"><?= $block['name'] ?></a></li>
                            <?php } ?>
                        </ul>
                        <div class="tab-content" style="padding-top: 20px;">
                            <div id="tab-0" class="tab-pane active">
                                <div class="panel-body">
                                    <?php
                                    foreach ($rows as $row){
                                        switch ($row['type']){
                                            case 'input':
                                                $param=empty($row['attr'])?[]:$row['attr'];
                                                echo $form->field($model, $row['name'])->textInput($param);
                                                break;

                                            case 'select':
                                                if (!empty($row['table'])) {
                                                    echo $form->field($model, $row['name'])->dropDownList(\backend\models\Help::getOption($row['table']), ['prompt' => 'оберіть', 'class'=>'select2 form-control']);
                                                } else if (isset($row['attr']['multiple'])) {
                                                    echo $form->field($model, $row['name'])->dropDownList($row['data'], ['prompt' => 'оберіть', 'class'=>'select2 form-control', 'multiple' => 'true']);
                                                } else {
                                                    echo $form->field($model, $row['name'])->dropDownList($row['data'], ['prompt' => 'оберіть', 'class'=>'select2 form-control']);
                                                }
                                                break;

                                            case 'url':
                                                if (!empty($row['table'])) {
                                                    echo $form->field($model, $row['name'])->dropDownList(\backend\models\Help::getOption($row['table']), ['prompt' => 'оберіть']);
                                                } else {
                                                    echo $form->field($model, $row['name'])->dropDownList($row['data'], ['prompt' => 'оберіть']);
                                                }
                                                break;

                                            case 'editor':
                                                echo $form->field($model, $row['name'])->widget(TinyMce::className(), [
                                                    'options' => ['rows' => 20],
                                                    'language' => 'ru',
                                                    'clientOptions' => [
                                                        'plugins' => [
                                                            "advlist autolink lists link charmap print preview anchor",
                                                            "searchreplace visualblocks code fullscreen",
                                                            "insertdatetime media table contextmenu paste image"
                                                        ],
                                                        'toolbar' => "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | responsivefilemanager link image media",
                                                        'external_filemanager_path' => '/admin/plugins/responsivefilemanager/',
                                                        'filemanager_title' => 'Responsive Filemanager',
                                                        'external_plugins' => [
                                                            //Иконка/кнопка загрузки файла в диалоге вставки изображения.
                                                            'filemanager' => '/admin/plugins/responsivefilemanager/plugin.min.js',
                                                            //Иконка/кнопка загрузки файла в панеле иснструментов.
                                                            'responsivefilemanager' => '/admin/plugins/responsivefilemanager/tinymce/plugins/responsivefilemanager/plugin.min.js',
                                                        ],
                                                    ]
                                                ]);
                                                break;

                                            case 'datepicker':
                                                echo $form->field($model, $row['name'])->widget(
                                                    'trntv\yii\datetime\DateTimeWidget',
                                                    [
                                                        'phpDatetimeFormat' => 'yyyy-MM-dd',
                                                        'clientOptions' => [
                                                            'minDate' => new \yii\web\JsExpression('new Date("2015-01-01")'),
                                                            'allowInputToggle' => false,
                                                            'sideBySide' => true,
                                                            'locale' => 'ru-ru',
                                                            'widgetPositioning' => [
                                                                'horizontal' => 'auto',
                                                                'vertical' => 'auto'
                                                            ]
                                                        ]
                                                    ]);
                                                break;

                                            case 'datetimepicker':
                                                echo $form->field($model, $row['name'])->widget(
                                                    'trntv\yii\datetime\DateTimeWidget',
                                                    [
                                                        'momentDatetimeFormat' => 'DD-MM-YYYY HH:mm',
                                                        'clientOptions' => [
                                                            'minDate' => new \yii\web\JsExpression('new Date("'.date("Y-m-d H:i").'")'),
                                                            'allowInputToggle' => false,
                                                            'sideBySide' => true,
                                                            'locale' => 'ru-ru',
                                                            'widgetPositioning' => [
                                                                'horizontal' => 'auto',
                                                                'vertical' => 'auto'
                                                            ]
                                                        ]
                                                    ]);
                                                break;

                                            case 'checkbox':
                                                echo $form->field($model, $row['name'])->checkbox();
                                                break;

                                            case 'file':
                                                ?>
                                                <input type="hidden" value="" name="<?= ucfirst($table) ?>[<?= $row['name'] ?>][]">
                                                <div class="form-group">
                                                    <label>Фото</label>
                                                    <div><button type="button" data-toggle="modal" data-target="#filemanager" class="btn btn-primary">Прикріпити файли</button></div>
                                                    <div class="loadedImage clearfix">
                                                        <?php

                                                        $files=json_decode($model[$row['name']]);
                                                        if (!empty($files)) {
                                                            foreach ($files as $file) {
                                                                ?>
                                                                <div class="item">
                                                                    <i class="fa fa-trash" onclick="$(this).parent().remove();"></i>
                                                                    <img src="<?= $file ?>" class="img-thumbnail">
                                                                    <input type="hidden" value="<?= $file ?>"
                                                                           name="<?= ucfirst($table) ?>[<?= $row['name'] ?>][]">
                                                                </div>
                                                                <?php
                                                            }
                                                        }
                                                        ?>
                                                    </div>
                                                </div>
                                                <div class="modal inmodal fade" id="filemanager" tabindex="-1" role="dialog"  aria-hidden="true">
                                                    <div class="modal-dialog modal-lg modal-files">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                                                <h4 class="modal-title">Файловий менеджер</h4>
                                                                <small class="font-bold">Завантажте та оберіть потрібні файли</small>
                                                            </div>
                                                            <div class="modal-body">
                                                                <div class="row">
                                                                    <div class="col-lg-3">
                                                                        <div class="ibox float-e-margins">
                                                                            <div class="ibox-content">
                                                                                <div class="file-manager">
                                                                                    <h5>Показати:</h5>
                                                                                    <a href="#" class="file-control active">Всі</a>
                                                                                    <a href="#" class="file-control">Документи</a>
                                                                                    <a href="#" class="file-control">Аудіо</a>
                                                                                    <a href="#" class="file-control">Фото</a>
                                                                                    <div class="hr-line-dashed"></div>
                                                                                    <button type="button" class="spin-button btn btn-primary btn-block" onclick="$(this).next().click();">Завантажити</button>
                                                                                    <input type="file" style="display: none;" multiple data-toggle="loadFiles" data-folder="/source/" data-parent="#filemanager" data-name="<?= ucfirst($table) ?>[<?= $row['name'] ?>]">
                                                                                    <div class="hr-line-dashed"></div>
                                                                                    <h5>Папки</h5>
                                                                                    <ul class="folder-list" style="padding: 0">
                                                                                        <?php foreach (\backend\models\Files::listFolder() as $folder){ ?>
                                                                                            <li><a href=""><i class="fa fa-folder"></i> <?= $folder ?></a></li>
                                                                                        <?php } ?>
                                                                                    </ul>
                                                                                    <div class="clearfix"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-lg-9 animated fadeInRight">
                                                                        <div class="row">
                                                                            <div class="col-lg-12 allBoxFiles">
                                                                                <?php
                                                                                foreach (\backend\models\Files::scanFile() as $file){
                                                                                    if ($file['type']=='doc'){
                                                                                        ?>
                                                                                        <div class="file-box">
                                                                                            <div class="file">
                                                                                                <input type="checkbox" data-name="<?= ucfirst($table) ?>[<?= $row['name'] ?>]" data-toggle="selectFile" data-file="/source/<?= $file['name'] ?>">
                                                                                                <a href="#">
                                                                                                    <span class="corner"></span>

                                                                                                    <div class="icon">
                                                                                                        <i class="fa <?= $file['icon'] ?>"></i>
                                                                                                    </div>
                                                                                                    <div class="file-name">
                                                                                                        <?= $file['name'] ?>
                                                                                                        <br/>
                                                                                                        <small>Розмір: <?= $file['size'] ?> Mb</small>
                                                                                                        <button type="button" class="btn btn-sm btn-danger pull-right" style="position: relative;bottom:10px" data-toggle="deleteFiles"><i class="fa fa-trash"></i> </button>
                                                                                                    </div>
                                                                                                </a>
                                                                                            </div>

                                                                                        </div>
                                                                                    <?php } else { ?>
                                                                                        <div class="file-box">
                                                                                            <div class="file">
                                                                                                <input type="checkbox" data-name="<?= ucfirst($table) ?>[<?= $row['name'] ?>]" data-toggle="selectFile" data-file="/source/<?= $file['name'] ?>">
                                                                                                <a href="#">
                                                                                                    <span class="corner"></span>

                                                                                                    <div class="image">
                                                                                                        <img alt="image" class="img-responsive" src="/source/<?= $file['name'] ?>">
                                                                                                    </div>
                                                                                                    <div class="file-name">
                                                                                                        <?= $file['name'] ?>
                                                                                                        <br/>
                                                                                                        <small>Розмір: <?= $file['size'] ?> Mb</small>
                                                                                                        <button type="button" class="btn btn-sm btn-danger pull-right" style="position: relative;bottom:10px" data-toggle="deleteFiles"><i class="fa fa-trash"></i> </button>
                                                                                                    </div>
                                                                                                </a>

                                                                                            </div>
                                                                                        </div>
                                                                                    <?} } ?>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-white" data-dismiss="modal">Відміна</button>
                                                                <button type="button" data-toggle="insertFiles" class="btn btn-primary">Обрати</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <?php
                                                break;
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                            <?php
                            foreach ($blocks as $block){
                            ?>
                            <div class="tab-pane" id="tab-<?= $block['id'] ?>">
                                <?php
                                $inputs=\backend\models\BlockInput::find()->where(['block_id'=>$block['id']])->all();
                                foreach ($inputs as $input){
                                    $value=\backend\models\InputValue::find()->where(['input_id'=>$input['id']])->one();
                                    ?>
                                    <div class="form-group clearfix">
                                        <label class="control-label"><?= $input['name'] ?></label>
                                        <?php
                                        switch ($input['type']){
                                            case 'input':
                                                ?>
                                                <input type="text" name="BlockInput[<?= $input['id'] ?>]" value="<?= $value['value'] ?>" class="form-control">
                                                <?php
                                                break;

                                            case 'editor':
                                                ?>
                                                <textarea rows="10" class="editor form-control" name="BlockInput[<?= $input['id'] ?>]"><?= $value['value'] ?></textarea>
                                                <?php
                                                break;
                                        }
                                        ?>
                                    </div>
                                    <?
                                }
                                ?>
<!--                                <div class="form-group">-->
<!--                                    <label>Код для вставки:</label>-->
<!--                                    <code style="display: block;">-->
<!--                                        --><?//= htmlspecialchars($block['code']) ?>
<!--                                    </code>-->
<!--                                </div>-->
                            </div>
                            <? } ?>
                        </div>
                    </div>
                    <button class="btn btn-success" style="margin-top: 20px;"><?= \backend\models\Help::Lang()->save ?></button>
<!--                    <button class="btn btn-warning" style="margin-top: 20px;" type="button" data-target="#add-block" data-toggle="modal">Создать блок</button>-->
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