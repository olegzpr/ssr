<div class="clearfix">
    <div class="dashboard-page-title pull-left">Добавить контакт</div>
</div>
<div class="row">
    <?php
    $form=\yii\widgets\ActiveForm::begin(['options'=>[
        'class'=>'col-xs-6',
        'data-pjax'=>true
    ], 'fieldConfig' => ['options' => ['tag' => false]]]);
    ?>
        <div class="styled-input-row">
            <label class="styled-label">Тип контакта</label>
            <div class="styled-input-col">
                <?php
                echo $form->field($model, 'type')->dropDownList($types,['onchange'=>'if ($(this).val()==2) { $("#program-box").show(); } else {$("#program-box").hide();}'])->label(false);
                ?>
            </div>
        </div>
        <div class="styled-input-row" <? if ($model['type']!=2) { echo 'style="display: none;"'; } ?> id="program-box">
            <label class="styled-label">Меседжеры</label>
            <div class="styled-input-col">
                <?php echo $form->field($model, 'params')->checkboxList($program)->label(false); ?>
            </div>
        </div>
        <div class="styled-input-row">
            <label class="styled-label">Значение</label>
            <div class="styled-input-col">
                <?php echo $form->field($model, 'value')->textInput(['class'=>'styled-input'])->label(false); ?>
            </div>
        </div>
    <div class="clearfix">
        <button class="btn btn-success">Добавить</button>
    </div>
    <?php \yii\widgets\ActiveForm::end(); ?>
</div>