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
                <a href="<?= Yii::$app->homeUrl ?><?= $table ?>"><?= $module ?></a>
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
                            <li><a data-toggle="tab" href="#tab-1" aria-expanded="true"> Английская версия</a></li>
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
                                                    if (isset($row['attr']['multiple'])) {
                                                        $model->$row['name']=json_decode($model->$row['name']);
                                                        echo $form->field($model, $row['name'])->dropDownList(\backend\models\Help::getOption($row['table']), ['prompt' => \backend\models\Help::Lang()->select, 'class' => 'select2 form-control', 'multiple'=>'true']);
                                                    } else {
                                                        echo $form->field($model, $row['name'])->dropDownList(\backend\models\Help::getOption($row['table']), ['prompt' => \backend\models\Help::Lang()->select, 'class' => 'select2 form-control']);
                                                    }
                                                } else {
                                                    if (isset($row['attr']['multiple'])) {
                                                        $model->$row['name']=json_decode($model->$row['name']);
                                                        echo $form->field($model, $row['name'])->dropDownList($row['data'], ['prompt' => \backend\models\Help::Lang()->select, 'class' => 'select2 form-control', 'multiple'=>'true']);
                                                    } else {
                                                        echo $form->field($model, $row['name'])->dropDownList($row['data'], ['prompt' => \backend\models\Help::Lang()->select, 'class' => 'select2 form-control']);
                                                    }
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
                                                    'clientOptions' => [
                                                        'plugins' => [
                                                            "advlist autolink lists link charmap print preview anchor",
                                                            "searchreplace visualblocks code fullscreen",
                                                            "insertdatetime media table contextmenu paste image"
                                                        ],
                                                        'toolbar' => "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | responsivefilemanager link image media",
                                                        'external_filemanager_path' => '/admin/plugins/responsivefilemanager/',
                                                        'filemanager_title' => 'Файловый менеджер',
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

                                            case 'textarea':
                                                echo $form->field($model, $row['name'])->textarea(['rows'=>5]);
                                                break;

                                            case 'file':
                                                ?>
                                                <input type="hidden" value="" name="<?= ucfirst($table) ?>[<?= $row['name'] ?>][]">
                                                <div class="form-group">
                                                    <label><?= $label[$row['name']] ?></label>
                                                    <div>
                                                        <input type="hidden" id="input_file_<?= $row['name'] ?>" data-name="<?= ucfirst($table) ?>[<?= $row['name'] ?>][]">
<!--                                                        <button type="button" data-toggle="modal" data-target="#filemanager" class="btn btn-primary">Прикріпити файли</button>-->
                                                        <a href="/admin/plugins/responsivefilemanager/dialog.php?type=2&field_id=input_file_<?= $row['name'] ?>&lang=ru_RU" class="btn iframe-btn btn-primary" type="button">Прикрепить файл</a>
                                                    </div>
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

                                                <?php
                                                break;

                                            case 'legend':
                                                ?>
                                                <div class="form-group">
                                                    <div class="alert alert-info">
                                                        <?php
                                                        foreach ($row['list'] as $key=>$value){
                                                            ?>
                                                            <div><?= $value ?></div>
                                                            <?
                                                        }
                                                        ?>
                                                    </div>
                                                </div>

                                                <?php
                                                break;
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                            <div id="tab-1" class="tab-pane">
                                <div class="panel-body">
                                    <?php
                                    foreach ($rows as $row){
                                        if ($row['trans']) {
                                            $value=\backend\models\Eng::find()->where(['item_id'=>$id, 'input'=>$row['name'], 'table'=>$table])->one();
                                            switch ($row['type']) {
                                                case 'input':
                                                    $param = empty($row['attr']) ? [] : $row['attr'];
                                                    ?>
                                                    <div class="form-group">
                                                        <label class="control-label"><?= $model->attributeLabels()[$row['name']] ?></label>
                                                        <input type="text" class="form-control"
                                                               name="Eng[<?= $row['name'] ?>]" value="<?=$value['value']?>">
                                                    </div>
                                                    <?php
                                                    break;

                                                case 'editor':
                                                    ?>
                                                    <div class="form-group">
                                                        <label class="control-label"><?= $model->attributeLabels()[$row['name']] ?></label>
                                                        <textarea rows="10" class="editor form-control"
                                                                  name="Eng[<?= $row['name'] ?>]"><?= $value['value'] ?></textarea>
                                                    </div>
                                                    <?php
                                                    break;


                                                case 'textarea':
                                                    ?>
                                                    <div class="form-group">
                                                        <label class="control-label"><?= $model->attributeLabels()[$row['name']] ?></label>
                                                        <textarea class="form-control" rows="5"
                                                                  name="Eng[<?= $row['name'] ?>]"><?=$value['value']?></textarea>
                                                    </div>
                                                    <?
                                                    break;
                                            }
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
                                $inputs=\backend\models\BlockInput::find()->where(['block_id'=>$block['id']])->orderBy('srt')->all();
                                foreach ($inputs as $input){
                                    $value=\backend\models\InputValue::find()->where(['input_id'=>$input['id'], 'element_id'=>$id])->one();
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

                                            case 'textarea':
                                                ?>
                                                <textarea rows="5" class="form-control" name="BlockInput[<?= $input['id'] ?>]"><?= $value['value'] ?></textarea>
                                                <?php
                                            break;

                                            case 'code':
                                                ?>
                                                <div id="editor_<?= $input['id'] ?>" style="width: 100%;min-height: 60px"><?= $input['default']!=''?$input['default']:htmlspecialchars($value['value']) ?></div>
                                                <script>
                                                    $(function () {
                                                        var editor = ace.edit("editor_<?= $input['id'] ?>");
                                                        editor.on('change', function () {
                                                            $("textarea[data-target=code-mirror<?= $input['id'] ?>").val(editor.getValue());
                                                        })
                                                    });
                                                </script>
                                                <textarea style="display: none" data-target="code-mirror<?= $input['id'] ?>" name="BlockInput[<?= $input['id'] ?>]"><?= $input['default']!=''?$input['default']:$value['value'] ?></textarea>
                                                <?php
                                                break;

                                            case 'file':
                                                ?>
                                                <div class="form-group">
                                                    <div>
                                                        <input type="hidden" id="input_file_<?= $input['id'] ?>" data-name="BlockInput[<?= $input['id'] ?>]">
                                                        <a href="/admin/plugins/responsivefilemanager/dialog.php?type=2&field_id=input_file_<?= $input['id'] ?>&lang=ru_RU" class="btn iframe-btn btn-primary" type="button">Прикрепить файл</a>
                                                    </div>
                                                    <div class="loadedImage clearfix">
                                                        <?php
                                                        if ($value['value']!='') {
                                                            ?>
                                                            <div class="item">
                                                                <i class="fa fa-trash" onclick="$(this).parent().remove();"></i>
                                                                <img src="<?= $value['value'] ?>" class="img-thumbnail">
                                                                <input type="hidden" value="<?= $value['value'] ?>"
                                                                       name="BlockInput[<?= $input['id'] ?>]">
                                                            </div>
                                                            <?php
                                                        }
                                                        ?>
                                                    </div>
                                                </div>

                                                <?php
                                                break;

                                            case 'link':
                                                ?>
                                                <iframe src="<?= $input['default']?>?hide_menu" style="width: 100%;height: 600px;" frameborder="0"></iframe>
                                                <?
                                                break;

                                            case 'file_array':
                                                ?>
                                            <div class="form-group">
                                                <div>
                                                    <input type="hidden" id="input_file_<?= $input['id'] ?>" data-name="BlockInput[<?= $input['id'] ?>][]">
                                                    <a href="/admin/plugins/responsivefilemanager/dialog.php?type=2&field_id=input_file_<?= $input['id'] ?>&lang=ru_RU" class="btn iframe-btn btn-primary" type="button">Прикрепить файл</a>
                                                </div>
                                                <div class="loadedImage clearfix">
                                                    <?php
                                                    if ($value['value']!='') {
                                                        $vl=json_decode($value['value']);
                                                        foreach ($vl as $lv) {
                                                            ?>
                                                            <div class="item">
                                                                <i class="fa fa-trash"
                                                                   onclick="$(this).parent().remove();"></i>
                                                                <img src="<?= $lv ?>" class="img-thumbnail">
                                                                <input type="hidden" value="<?= $lv ?>"
                                                                       name="BlockInput[<?= $input['id'] ?>][]">
                                                            </div>
                                                            <?php
                                                        }
                                                    }
                                                    ?>
                                                </div>
                                            </div>

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