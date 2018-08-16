<?php
$this->title = 'Сообщения';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>'/my/messages']);?>
        </div>
        <div class="col-md-9 flex-message">
            <div class="my-box border-box">
                <div class="action-top clearfix">
                    <div class="search">
                        <i class="fa fa-search"></i>
                        <input type="text" placeholder="Поиск">
                    </div>
                    <div class="more">
                        <i class="fa fa-ellipsis-h"></i>
                    </div>
                </div>
                <?php
                foreach ($sender as $send){
                    $user = \common\models\User::findOne(['username'=>$send]);
                    $lastMessage = \frontend\models\Messages::find()->where('(from_user=:user_1 and to_user=:user_2) or (from_user=:user_2 and to_user=:user_1)', ['user_1'=>$send, 'user_2'=>Yii::$app->user->identity->username])->orderBy('data DESC')->one();
                    $unread = \frontend\models\Messages::find()->where('from_user=:user_1 and to_user=:user_2 and status=0', ['user_1'=>$send, 'user_2'=>Yii::$app->user->identity->username])->andWhere(['status'=>0])->count();
                ?>
                <div class="one-sms clearfix" data-send="<?=$send?>">
                    <div class="img">
                        <img src="/images/no-photo.jpg" alt="">
                        <span class="online"></span>
                    </div>
                    <div class="text">
                        <div class="name"><?=$user['name']==''?$user['username']:$user['name']?></div>
                        <p><?=$lastMessage['text']?></p>
                    </div>
                    <div class="data">
                        <div class="time"><?=date("H:i", strtotime($lastMessage['data']))?></div>
                        <?php
                        if ($unread>0){
                        ?>
                        <span><?=$unread?></span>
                        <?php } ?>
                    </div>
                </div>
                <?php } ?>
                <div class="one-sms clearfix">
                    <div class="img">
                        <img src="/images/support.png" alt="">
                        <span class="online"></span>
                    </div>
                    <div class="text">
                        <div class="name">Служба поддержки</div>
                    </div>
                    <div class="data">

                    </div>
                </div>
            </div>
            <div class="box-text-message">
                <div class="head">
                    <div class="name">
                        <strong>Марина Кузькина</strong> была в сети сегодня в 20:11
                    </div>
                </div>
                <div class="body" id="list-sms">

                </div>
                <div class="read-box">
                    <a href="#"><i class="fa fa-paperclip"></i></a>
                    <input type="text" name="text" placeholder="Напишите сообщение...">
                    <a href="#" id="send-sms"><i class="fa fa-paper-plane-o"></i></a>
                </div>
            </div>
        </div>
    </div>
</div>