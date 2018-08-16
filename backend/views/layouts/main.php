<?php

/* @var $this \yii\web\View */
/* @var $content string */

use backend\assets\AppAsset;
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use common\widgets\Alert;
use backend\widget\Menu;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <script type="application/javascript" src="/admin/js/jquery-2.1.1.js"></script>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div id="wrapper">
    <?php
    if (!isset($_REQUEST['hide_menu'])){
    ?>
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="sidebar-collapse">
            <ul class="nav metismenu" id="side-menu">
                <li class="nav-header">
                    <div class="dropdown profile-element">
                        <span>
                            <img alt="image" class="img-circle" src="<?= Yii::$app->homeUrl ?>/img/profile_small.jpg"/>
                        </span>
                        <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                            <span class="clear">
                                <span class="block m-t-xs">
                                    <strong class="font-bold"><?= Yii::$app->user->identity->name ?></strong>
                                </span>
                                <span class="text-muted text-xs block"><?= \backend\models\User::$role[Yii::$app->user->identity->role] ?> <b class="caret"></b></span>
                            </span>
                        </a>
                        <ul class="dropdown-menu animated fadeInRight m-t-xs">
                            <form action="/admin/logout" id="logout" method="post">
                                <? echo Html :: hiddenInput(\Yii :: $app->getRequest()->csrfParam, \Yii :: $app->getRequest()->getCsrfToken(), []); ?>
                            </form>
                            <li><a href="javascript:;" onclick="$('#logout').submit();">Выход</a></li>
                        </ul>
                    </div>
                    <div class="logo-element">
                        W4U
                    </div>
                </li>
                <?php
                echo Menu::widget(['active'=>$_SERVER['REQUEST_URI']]);
                ?>
            </ul>

        </div>
    </nav>
    <? } ?>
    <div id="page-wrapper" <? if (isset($_REQUEST['hide_menu'])) echo 'style="margin-left:0!important;"'; ?> class="gray-bg dashbard-1">
<!--        <div class="row border-bottom">-->
<!--            <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">-->
<!--                <div class="navbar-header">-->
<!--                    <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i>-->
<!--                    </a>-->
<!--                    <form role="search" class="navbar-form-custom" action="search_results.html">-->
<!--                        <div class="form-group">-->
<!--                            <div class="col-md-5"><input type="text" placeholder="Пошук..." class="form-control" name="top-search" id="top-search"></div>-->
<!--                            <div class="col-md-5">-->
<!--                                <select class="form-control">-->
<!--                                    <option value="">розділ</option>-->
<!--                                </select>-->
<!--                            </div>-->
<!--                            <div class="col-md-2">-->
<!--                                <button class="btn btn-success btn-sm" style="margin-top: 15px;"><i class="fa fa-search"></i></button>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </form>-->
<!--                </div>-->
<!--            </nav>-->
<!--        </div>-->
        <?= $content ?>
    </div>
    <? //\backend\widget\Chat::widget(); ?>
    <? //\backend\widget\Sidebar::widget(); ?>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
