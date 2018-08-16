<?php
$this->title = 'Уведомления';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>'/my/notifications']);?>
        </div>
        <div class="col-md-9">
            <?php
            foreach ($sysNotify as $noty){
                $reads = $noty['read']==''?[]:json_decode($noty['read']);
                if (!in_array(Yii::$app->user->identity->username, $reads)){
                    $reads[] = Yii::$app->user->identity->username;
                    $model = \backend\models\SystemNotifications::findOne($noty['id']);
                    $model->read = json_encode($reads);
                    $model->save();
                }
            ?>
            <div class="notify-box">
                <div class="title"><?=$noty['title']?></div>
                <div class="date"><? $date = new \DateTime($noty['data']); echo $date->format("H:i d.m.Y")?></div>
                <div class="text"><?=$noty['text']?></div>
            </div>
            <?php } ?>
        </div>
    </div>
</div>