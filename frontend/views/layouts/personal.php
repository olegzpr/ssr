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
<div class="page-wrapper dashboard">
    <div class="dashboard-menu">
        <div class="dash-menu-inner">
            <div class="logo-row">
                <a href="/" class="logo"><img src="/images/logo-white.png" alt="">
                </a><a href="#" class="dash-menu-close"></a>
            </div>
            <ul class="dash-menu">
                <?php
                $menu=[
                    ''=>['Моя страница','/images/dash-menu-1.png'],
                    '/items'=>['Мои обьявления','/images/dash-menu-2.png',['objects'=>'Мои объекты','applications'=>'Мои заявки']],
                    '/sms'=>['Мои сообщения','/images/dash-menu-3.png'],
                    '/alerts'=>['Мои оповещания','/images/dash-menu-4.png'],
                    '/favorite'=>['Мои избранные','/images/dash-menu-5.png'],
                    '/settings'=>['Приватность','/images/dash-menu-6.png'],
                    '/varification'=>['Варификация','/images/dash-menu-6.png'],
                    '/money'=>['Кошелек','/images/dash-menu-2.png'],
                ];
                foreach ($menu as $key=>$value){
                    $class=$this->params['page']==$key?'active':'';
                    if (isset($value[2])){
                        $o=0;
                        foreach ($value[2] as $sk=>$sv){
                            if ($o==0) {
                                $dop_url = '/'.$sk;
                                $o++;
                            }
                        }
                    } else {
                        $dop_url=$key;
                    }
                ?>
                <li><a href="/my<?php echo $dop_url ?>" class="<?=$class?>"><span class="ico"><img src="<?=$value[1]?>" alt=""></span> <?=$value[0]?></a>
                    <?php
                    if (isset($value[2])){
                        echo '<ul class="sub-menu">';
                        foreach ($value[2] as $skey=>$svalue){
                            echo '<li><a href="'.$skey.'">- '.$svalue.'</a>';
                        }
                        echo '</ul>';
                    }
                    ?>
                </li>
                <? } ?>
            </ul>
        </div>
    </div>
    <div class="dashboard-main">
        <div class="dash-top">
            <div class="dash-top-menu-toggle"></div>
            <div class="dash-top-search">
                <form action="dashhelp">
                    <input type="text" placeholder="Что я могу для вас сделать?">
                </form>
            </div>
            <ul class="dash-top-service">
                <li><a href="#" class="dash-service-item"><img src="/images/dash-top-like.png" alt=""></a></li>
                <li><a href="#" class="dash-service-item"><img src="/images/dash-top-mail.png" alt=""><span
                            class="number">7</span></a></li>
                <li><a href="#" class="dash-service-item"><img src="/images/dash-top-notif.png" alt=""><span
                            class="number">2</span></a></li>
                <li class="mobile-right"><a href="/add" class="btn btn-primary"><i class="plus"></i><span
                            class="hide-on-mobile">Добавить</span></a></li>
            </ul>
            <div class="dash-top-right">
                <div class="dropdown styled-dropdown dash-user">
                    <div class="dropdown-toggle" type="button" data-toggle="dropdown">
                        <div class="name"><?=Yii::$app->user->identity->name?></div>
                        <div class="photo" style="background-image: url('<?=json_decode(Yii::$app->user->identity->photo)[0]?>')"></div>
                    </div>
                    <ul class="dropdown-menu">
                        <li><a href="#">Выйти</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <?=$content?>
    </div>
</div>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>