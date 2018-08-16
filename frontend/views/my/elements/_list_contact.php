<div class="clearfix">
    <div class="dashboard-page-title pull-left">Мои контакты</div>
    <a href="/my/add-contact" class="btn btn-success pull-right" style="margin-bottom: 20px;">Добавить</a>
</div>
<?php
$dataProvider = new \yii\data\ActiveDataProvider([
    'query' => \backend\models\Contacts::find()->where(['user'=>Yii::$app->user->identity->id]),
    'pagination' => [
        'pageSize' => 10,
    ],
]);
echo \yii\grid\GridView::widget([
    'dataProvider' => $dataProvider,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
        [
            'attribute'=>'type',
            'content'=>function($data){
                return \backend\models\ContactType::findOne($data['type'])['name'];
            }
        ],
        'value',
        [
            'class' => 'yii\grid\ActionColumn',
            'template' => '{update} {delete}',
            'buttons' => [
                'update' => function ($url,$model) {
                    return \yii\helpers\Html::a(
                        'изменить',
                        'my/contact-edit?id='.$model['id']);
                },
                'delete' => function ($url,$model,$key) {
                    return \yii\helpers\Html::a('<span style="color:red">удалить</span>', 'my/contact-delete?id='.$model['id']);
                },
            ],
        ],
    ],
]);
?>