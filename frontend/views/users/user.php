<?php
use yii\bootstrap\Html;

$this->title='Страница пользователя';
$this->params['page']='user';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-12">
            <div class="cover" style="background: url('<?=\common\models\Helper::getOnePicture(Yii::$app->user->identity->cover)?>') no-repeat center center/cover">
            </div>

            <div class="sub-navs">
                <div class="row clearfix">
                    <div class="col-md-3">
                        <div class="avatar">
                            <img src="<?=\common\models\Helper::getOnePicture(Yii::$app->user->identity->photo, true)?>" alt="<?=Yii::$app->user->identity->name?>" alt="<?=Yii::$app->user->identity->name?>" id="user-avatar">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <ul class="clearfix">
                            <li class="active"><a href="#tab1" data-toggle="tabs-page">Объекты</a></li>
                            <li><a href="#tab2" data-toggle="tabs-page">Спрос</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="row basic-box">
                <div class="col-md-3">
                    <div class="user-information">
                        <div class="title">Подтверждённая информация</div>
                        <div class="line">Киев, Украина</div>
                        <div class="line">На сайте с июль 2017</div>
                        <div class="line">Всего объектов: 12</div>
                        <div class="line">Удостоверение личности
                            гос. образца
                        </div>
                        <div class="line">Селфи</div>
                        <div class="line">Электронная почта</div>
                        <div class="line">Номер телефона</div>
                    </div>
                </div>
                <div class="col-md-6"></div>
                <div class="col-md-3">
                    <button class="btn btn-success btn-full">Написать сообщение</button>
                    <div class="contact-box">
                        <div class="title">Контакты</div>
                        <div class="line"><i class="fa fa-phone"></i> 8 (050) 123 45 67 <i class="fa fa-telegram app-active"></i></div>
                        <div class="line"><i class="fa fa-envelope-o"></i> Показать email</div>
                        <div class="line"><i class="fa fa-facebook-f"></i> Страница facebook</div>
                        <div class="line"><i class="fa fa-twitter"></i> Аккаунт Twitter</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="writeNote" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <form id="form-note-add">
                    <?php
                    echo Html :: hiddenInput(\Yii :: $app->getRequest()->csrfParam, \Yii :: $app->getRequest()->getCsrfToken(), []);
                    ?>
                    <input type="hidden" name="id" value="">
                    <div class="login-container">
                        <div class="title">Новая заметка</div>
                    </div>
                    <div class="login-container">
                        <div class="login-input-row">
                            <textarea class="login-area" name="text" rows="5" placeholder="Текст"></textarea>
                        </div>
                        <button class="btn btn-primary btn-login">Написать</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div id="editNote" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <form id="form-note-edit">
                    <?php
                    echo Html :: hiddenInput(\Yii :: $app->getRequest()->csrfParam, \Yii :: $app->getRequest()->getCsrfToken(), []);
                    ?>
                    <input type="hidden" name="id" value="">
                    <div class="login-container">
                        <div class="title">Заметка</div>
                    </div>
                    <div class="login-container">
                        <div class="login-input-row">
                            <textarea class="login-area" name="text" rows="5" placeholder="Текст"></textarea>
                        </div>
                        <button class="btn btn-primary btn-login">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div id="saveFilter" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <form id="form-save-filter">
                    <?php
                    echo Html :: hiddenInput(\Yii :: $app->getRequest()->csrfParam, \Yii :: $app->getRequest()->getCsrfToken(), []);
                    ?>
                    <div class="login-container">
                        <div class="title">Сохранение фильтров</div>
                    </div>
                    <div class="login-container">
                        <div class="login-input-row">
                            <input type="text" class="login-input" name="name" placeholder="Название набора">
                        </div>
                        <button class="btn btn-primary btn-login">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="backdoor"></div>
<div class="maps-item-box">
    <a href="#" class="close"></a>

    <div class="res">
        Подождите...
    </div>
</div>