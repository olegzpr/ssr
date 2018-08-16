<?php
$this->title='Добавить объявление';
$this->params['page']='add';
use yii\helpers\Html;
?>
<div class="container">
    <?php
    echo \frontend\components\StepWidget::widget(['mask'=>Yii::$app->session->get('mask'), 'step'=>Yii::$app->request->get('step'), 'id'=>null]);
    if (!isset($_GET['id'])) {
        $form = \yii\bootstrap\ActiveForm::begin(['action' => '/add/step?step='.Yii::$app->request->get('step'), 'options' => ['class' => 'styled-form']]);
    } else {
        $form = \yii\bootstrap\ActiveForm::begin(['action' => '/add/step?step='.Yii::$app->request->get('step').'&id='.Yii::$app->request->get('id'), 'options' => ['class' => 'styled-form']]);
    }
    $rows=\backend\models\Rows::find()->where(['step_id'=>Yii::$app->request->get('step')])->orderBy('id')->all();
    foreach ($rows as $row){
    ?>
    <div class="row" data-id="<?=$row['id']?>">
        <div class="col-sm-12">
            <?php
            echo \common\models\Helper::rowDraw($row);
            ?>
        </div>
    </div>
    <?php } ?>
    <div class="row clearfix">
        <div class="col-md-12 text-right">
            <button class="btn btn-primary">Продолжить <i class="fa fa-long-arrow-right"></i></button>
        </div>
    </div>
    <? \yii\bootstrap\ActiveForm::end() ?>
</div>