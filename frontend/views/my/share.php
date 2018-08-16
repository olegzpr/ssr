<?php
$this->params['page']='';
$this->title='Личный кабинет';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>'/my/share']);?>
        </div>
        <div class="col-md-9">
            <div class="my-box">
                <div class="title">Пригласить друзей</div>
                <?php
                \yii\widgets\Pjax::begin(['enablePushState' => false]);
                $form = \yii\bootstrap\ActiveForm::begin(['action'=>'/my/share-sms', 'options'=>['class'=>'field', 'data-pjax' => true]]);
                ?>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-3">
                        <div class="label" style="color: black">
                            <i class="fa fa-phone"></i>
                            Номер телефона:
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="row clearfix">
                            <div class="col-md-6">
                                <div class="rows-relative"><input type="text" name="phone" value="" required class="form-control"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-9 col-md-offset-3">
                        <button class="btn btn-success">Пригласить</button>
                    </div>
                </div>
                <?php
                \yii\bootstrap\ActiveForm::end();
                \yii\widgets\Pjax::end();
                ?>
                <hr/>
                <div class="title">Рассказать друзьям</div>
                <div class="share42init" data-url="http://place.w4u.pp.ua/" data-title="Самсебереелтор" data-description="Поиск и продажа квартир без посредников" data-image="http://place.w4u.pp.ua/images/logo.png"></div>
            </div>
        </div>
    </div>
</div>
