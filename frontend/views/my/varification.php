<?php
$this->params['page']='';
$this->title='Личный кабинет';

use yii\grid\GridView;
use yii\data\ActiveDataProvider;
?>

<div class="dashboard-content dashboard-padding">
    <?php
    $form=\yii\bootstrap\ActiveForm::begin(['options'=>['class'=>'styled-form'],'fieldConfig' => [
        'options' => [
            'tag' => false,
        ],
    ]]);
    ?>
    <div class="dash-content-limiter">
        <div class="dashboard-page-title">Варификация</div>
        <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="styled-input-row">
                    <label class="styled-label">Загрузить документы</label>
                    <div class="styled-input-col">
                        <input type="file" id="docs">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="text-center">
        На данный момент вы не проходили варификации
    </div>
    <?php \yii\bootstrap\ActiveForm::end();?>
</div>
