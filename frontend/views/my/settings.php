<?php
$this->params['page'] = '';
$this->title = 'Личный кабинет';

use yii\grid\GridView;
use yii\data\ActiveDataProvider;

?>

<div class="dashboard-content dashboard-padding">
    <?php
    $form = \yii\bootstrap\ActiveForm::begin(['options' => ['class' => 'styled-form'], 'fieldConfig' => [
        'options' => [
            'tag' => false,
        ],
    ]]);
    ?>
    <div class="dash-content-limiter">
        <div class="dashboard-page-title">Настройки приватности</div>
        <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
                <?php
                $form=\yii\bootstrap\ActiveForm::begin();
                $lists = \backend\models\PrivatesList::find()->all();
                foreach ($lists as $list) {
                    $main = \backend\models\Privates::find()->where(['user' => Yii::$app->user->identity->id, 'private_id' => $list['id']])->one();
                    ?>
                    <div class="styled-input-row">
                        <label class="styled-label"><?php echo $list['name'] ?></label>
                        <div class="styled-input-col">
                            <input type="checkbox" value="1" <?php if (!empty($main)) echo 'checked'; ?>
                                   name="Privates[<?php echo $list['id'] ?>]">
                        </div>
                    </div>
                <?php } ?>
                <div class="text-center">
                    <button class="btn btn-primary styled-form-btn">Сохранить</button>
                </div>
                <?php
                \yii\bootstrap\ActiveForm::end();
                ?>
            </div>
        </div>
    </div>

    <?php \yii\bootstrap\ActiveForm::end(); ?>
</div>
