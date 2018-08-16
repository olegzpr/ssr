<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use frontend\assets\AppAsset;
use common\widgets\Alert;
use lavrentiev\widgets\toastr\Notification;
use yii\bootstrap\ActiveForm;

if (!Yii::$app->user->isGuest) {
    Yii::$app->view->registerJs("var uphone = " . Yii::$app->user->identity->username . ";",  \yii\web\View::POS_HEAD);
//начало многосточной строки, можно использовать любые кавычки
$uid = Yii::$app->user->identity->id;
$script = <<< JS
    socket = new WebSocket('ws://w4u.pp.ua:4001');//помните про порт: он должен совпадать с тем, который использовался при запуске серверной части

    socket.onopen = function(e) {
        socket.send('{"action":"start","user":"$uid"}'); //часть моего кода. Сюда вставлять любой валидный json.
    };
JS;
//маркер конца строки, обязательно сразу, без пробелов и табуляции
    $this->registerJs($script, yii\web\View::POS_READY);
}

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!doctype html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|PT+Sans:400,700|Roboto:400,700&amp;subset=cyrillic" rel="stylesheet">
</head>
<body>
<?php $this->beginBody() ?>
<?= \lavrentiev\widgets\toastr\NotificationFlash::widget() ?>
<?=\Yii::$app->session->getFlash('error'); ?>
<div class="mobile-menu">
    <div class="mobile-menu-container">
        <div class="mobile-menu-container-inner">
            <a href="/add" class="btn btn-white mobile-menu-white-btn">Подать объявление</a>
            <ul class="mobile-menu-list">
                <?php
                $nav=[
                        'catalog'=>'База квартир',
                        'faq'=>'База знаний',
                        'soobshchestvo'=>'Сообщество',
                        'services'=>'Сервисы <i class="fa fa-chevron-down"></i>',

                ];
                if (!isset($this->params['page'])){
                    $this->params['page']='default';
                }
                foreach ($nav as $key=>$value){
                ?>
                <li><a <?php if ($this->params['page']==$key) echo 'class="active"'; ?> href="/<?=$key?>"><?=$value?></a></li>
                <?php
                }
                ?>
            </ul>
        </div>
    </div>
</div>
<div class="page-wrapper">
    <div class="header">
        <div class="header-main">
            <div class="container">
                <div class="row">
                    <div class="col-md-3 col-sm-4">
                        <a href="/" class="logo"><img src="/images/logo.png" alt=""></a>
                    </div>
                    <div class="col-md-6 col-sm-8 hidden-xs">
                        <ul class="header-menu">
                            <?php
                            foreach ($nav as $key=>$value){
                                ?>
                                <li><a href="/<?=$key?>"><?=$value?></a></li>
                                <?php
                            }
                            ?>
                        </ul>
                        <?php
                        if (Yii::$app->user->isGuest){
                            ?>
                            <a href="#loginModal" data-toggle="modal" class="login-link"><i class="fa fa-user"></i> Войти</a>
                        <?php } else { ?>
<!--                            --><?//= Html::a('Выход',
//                                ['/logout'], [
//                                    'data-method' => 'POST',
//                                    'data-params' => [],
//                                ]) ?>
                            <div class="user-top-proff">
                                <div class="image">
                                    <div class="img">
                                        <img src="<?=\common\models\Helper::getOnePicture(Yii::$app->user->identity->photo, true)?>" alt="<?=Yii::$app->user->identity->name?>">
                                    </div>
                                    <?php
                                    $sysNotify = \backend\models\SystemNotifications::find()->where(['AND', ['OR', ['user'=>null], ['user'=>Yii::$app->user->identity->username]], ['OR', ['not like', 'read', Yii::$app->user->identity->username], ['read'=>null]]])->all();
                                    if (!empty($sysNotify)){
                                    ?>
                                    <span class="message"><?=count($sysNotify)?></span>
                                    <?php } ?>
                                    <span class="status online"></span>
                                </div>
                                <div class="action">
                                    <?php
                                    $name = Yii::$app->user->identity->name==''?Yii::$app->user->identity->username:Yii::$app->user->identity->name;
                                    echo \common\models\Helper::getShortText($name, 8);
                                    ?><i class="fa fa-chevron-down"></i>
                                </div>

                                <div class="poper-modal">
                                    <a href="/my">Кабинет</a>
                                    <a href="/logout">Выход</a>
                                </div>
                            </div>
                        <? } ?>
                    </div>
                    <div class="col-md-3 col-sm-12 text-center-sm hidden-xs clearfix">
                        <a href="/add" class="btn btn-primary header-btn-add">Добавить обьявление</a>
                    </div>
                </div>
                <i class="fa fa-bars mobile-icon-menu fa-3x"></i>
            </div>
        </div>
    </div>

    <?=$content?>

    <div class="footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-3 col-sm-push-3">
                    <ul class="footer-col-list">
                        <li><a href="#">База недвижимости</a></li>
                        <li><a href="#">База знаний</a></li>
                        <li><a href="#">Заявки</a></li>
                        <li><a href="#">Сервисы</a></li>
                        <li><a href="#">Услуги</a></li>
                        <li><a href="#">Добавить объявление</a></li>
                    </ul>
                </div>
                <div class="col-sm-3 col-sm-push-3">
                    <ul class="footer-col-list">
                        <li><a href="#">О нашем сервисе</a></li>
                        <li><a href="#">Условия использования</a></li>
                        <li><a href="#">Помощь по сайту</a></li>
                        <li><a href="#">Предложения и пожелания</a></li>
                        <li><a href="#">Отзывы пользователей</a></li>
                        <li><a href="#">Расскажи друзьям о сайте</a></li>
                    </ul>
                </div>
                <div class="col-sm-3 col-sm-push-3">
                    <div class="footer-col-title">Есть вопросы? Звоните!</div>
                    <div class="footer-info">
                        <div class="group">
                            <div class="title">Звонки по городу</div>
                            <div class="bold"><a href="tel:000">38 (097) 123 32 32</a></div>
                            <div class="link"><a href="#">Заказать звонок</a></div>
                        </div>
                        <div class="group">
                            <div class="title">Пишите на почту</div>
                            <div class="bold"><a href="mailto:admin@gmail.com">admin@gmail.com</a></div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 col-sm-pull-9">
                    <a href="#" class="logo"><img src="/images/logo.png" alt=""></a>
                    <div class="footer-copyright">
                        <p>© 2016 «Самсебериелтор»</p>
                        <p>Все права защищены.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="loginModal" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-title">
                <strong>Пожалуйста, войдите или зарегистрируйтесь,</strong>
                чтобы получить полный доступ к сайту
            </div>
            <div class="modal-body">
                <ul class="tab-buttons modal-tabs-btn">
                    <li><a href="#" class="tab-btn active" data-target="#login">Авторизация</a></li>
                    <li><a href="#" class="tab-btn" data-target="#registration">Регистрация</a></li>
                </ul>
                <div class="tab-container">
                    <div class="tab-content active" data-tab="#login">
                        <?php
                        $login = new \common\models\LoginForm();
                        $form = ActiveForm::begin(['action'=>'/login', 'id'=>'login-form', 'enableAjaxValidation' => true, 'fieldConfig' => [
                            'options' => [
                                'tag' => false,
                            ],
                        ]]);
                        ?>
                        <div class="login-container">
                            <div class="login-input-row">
                                <?=$form->field($login, 'username')->textInput(['class'=>'login-input place','placeholder'=>'Введите ваш номер телефона'])->label(false);?>
                            </div>
                            <div class="login-input-row">
                                <?=$form->field($login, 'password')->textInput(['class'=>'login-input place','placeholder'=>'Введите ваш пароль'])->label(false);?>
                                <div class="text-right"><a href="/forgot" class="forget-link">Забыли пароль?</a></div>
                            </div>
                            <button class="btn btn-primary btn-login">Войти</button>
                        </div>
                        <?php
                        ActiveForm::end();
                        ?>
                    </div>
                    <div class="tab-content" data-tab="#registration">
                        <?php
                        $register = new \frontend\models\SignupForm();
                        $form = ActiveForm::begin(['action'=>'/register', 'id'=>'register-form', 'enableAjaxValidation' => true, 'fieldConfig' => [
                            'options' => [
                                'tag' => false,
                            ],
                        ]]);
                        ?>
                        <div class="login-container">
                            <div class="title">Регистрация</div>
                        </div>
                        <div class="login-container">
                            <div class="login-input-row">
                                <?=$form->field($register, 'username')->textInput(['class'=>'login-input place', 'data-inputmask'=>'\'mask\': \'+389999999999\'', 'placeholder'=>'Введите ваш номер телефона', 'id'=>'phone-type'])->label(false)?>
                            </div>
                            <div class="login-input-row">
                                <div class="row clearfix">
                                    <div class="col-md-12 text-center">
                                        Проверьте номер Вашего телефона и нажмите Ок
                                        для полученя пароля по СМС, на ваш телефон
                                    </div>
                                </div>
                            </div>
                            <div class="login-input-row">
                                <?=$form->field($register, 'code')->textInput(['class'=>'login-input place', 'placeholder'=>'Введите пароль, присланный по СМС'])->label(false)?>
                            </div>
                            <div class="login-input-row text-center">
                                <strong>Нажимая «Зарегестрироваться», вы соглашаетесь с нашими <a href="#">Условиями использования</a></strong>
                            </div>
                            <button class="btn btn-primary btn-login">Зарегистрироваться</button>
                        </div>
                        <?php
                        ActiveForm::end();
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
