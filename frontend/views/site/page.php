<?php

/* @var $this yii\web\View */

use yii\helpers\Html;

$this->title = $title;
$this->params['page']=$pref;
?>
<div class="container">
    <div class="section">
        <div class="breadcrumbs-wrapper">
            <ul class="breadcrumbs">
                <li><a href="/">Главная</a></li>
                <li>
                    <span><?=$title?></span>
                </li>
            </ul>
        </div>
        <div class="section-title section-title-small"><span><?=$title?></span></div>
        <?=$text?>
    </div>
</div>