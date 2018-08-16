<?php
$this->params['page'] = '';
$this->title = 'Мои оповещения';

use yii\grid\GridView;
use yii\data\ActiveDataProvider;

\yii\widgets\Pjax::begin(['enablePushState' => false]);
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
            <div class="dashboard-page-title">Настройка оповещений</div>
            <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-12">
                    <div class="styled-input-row">
                        <label class="styled-label">Присылать новости сайта</label>
                        <div class="styled-input-col">
                            <?php
                            $form = \yii\bootstrap\ActiveForm::begin(['options' => ['data-pjax' => true]]);
                            $contacts = \backend\models\Contacts::find()->where(['user' => Yii::$app->user->identity->id])->all();
                            foreach ($contacts as $contact) {
                                if ($contact['type'] == 1) {
                                    $alert = \backend\models\Alerts::find()->where(['user' => Yii::$app->user->identity->id, 'contact_id' => $contact['id'], 'alert_type' => 1])->one();
                                    $checkbox = empty($alert) ? '' : 'checked';
                                    ?>
                                    <div>
                                        <input type="checkbox" <?php echo $checkbox ?>
                                               value="<?php echo $contact['id'] ?>"
                                               name="Email[1][]"> <?php echo $contact['value'] ?>
                                    </div>
                                    <?php
                                } else {
                                    $programs = json_decode($contact['params']);
                                    foreach ($programs as $program) {
                                        $alert = \backend\models\Alerts::find()->where(['user' => Yii::$app->user->identity->id, 'contact_id' => $contact['id'], 'alert_type' => 1, 'chanel'=>$program])->one();
                                        $checkbox = empty($alert) ? '' : 'checked';
                                        ?>
                                        <div>
                                            <input type="checkbox" <?php echo $checkbox ?> value="<?php echo $contact['id'] ?>"
                                                   name="App[1][<?php echo $program ?>][]"> <?php echo $contact['value'] ?>
                                            (<?php echo \backend\models\Contacts::$program[$program] ?>)
                                        </div>
                                        <?php
                                    }
                                }
                            }
                            ?>
                            <button class="btn btn-primary" style="margin-top: 40px;">Сохранить</button>
                            <?php
                            \yii\bootstrap\ActiveForm::end();
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php \yii\bootstrap\ActiveForm::end(); ?>
    </div>
<?php
\yii\widgets\Pjax::end();