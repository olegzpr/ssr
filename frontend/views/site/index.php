<?php

/* @var $this yii\web\View */

$this->title = 'Главная';
$this->params['page']='start';
use frontend\models\Items;
use yii\bootstrap\Html;
?>
<div class="search-box">
    <div class="title">Снимай и покупай у собственников!</div>
    <div class="intro">База жилой и коммерческой недвижимости - квартиры, офисы, гаражи, комнаты, склады, здания</div>
    <?php
    $form=\yii\bootstrap\ActiveForm::begin(['action'=>'/catalog', 'method'=>'get', 'options'=>['class'=>'search-start-form']]);
    ?>
    <div class="row clearfix box-from-input">
        <div class="col-md-3 col-sm-3">
            <select class="styled-select" name="filter_1">
                <?php
                $values = \backend\models\RowValues::find()->where(['input_id'=>1])->all();
                foreach ($values as $value){
                ?>
                <option value="<?=$value['value']?>"><?=$value['label']?></option>
                <?php } ?>
            </select>
        </div>
        <div class="col-md-3 col-sm-3">
            <select class="styled-select" name="filter_2">
                <?php
                $values = \backend\models\RowValues::find()->where(['input_id'=>2])->all();
                foreach ($values as $value){
                    ?>
                    <option value="<?=$value['value']?>"><?=$value['label']?></option>
                <?php } ?>
            </select>
        </div>
        <div class="col-md-3 col-sm-3">
            <select class="styled-select" name="filter_3">
                <?php
                $values = \backend\models\RowValues::find()->where(['input_id'=>3])->all();
                foreach ($values as $value){
                    ?>
                    <option value="<?=$value['value']?>"><?=$value['label']?></option>
                <?php } ?>
            </select>
        </div>
        <div class="col-md-3 col-sm-3">
            <select class="styled-select" data-search="true" name="city">
                <?php
                $values = \backend\models\GeoCity::find()->orderBy('name')->all();
                foreach ($values as $value){
                    ?>
                    <option value="<?=$value['id']?>"><?=$value['name']?></option>
                <?php } ?>
            </select>
        </div>
    </div>
    <div class="text-center">
        <button class="btn btn-primary">Найти объявления</button>
    </div>
    <?php
    \yii\bootstrap\ActiveForm::end();
    ?>
</div>

<div class="container">
    <div class="section">
        <div class="section-title section-title-small"><span>Преимущества нашего сервиса</span></div>
        <div class="row advantages-list">
            <div class="col-sm-3">
                <div class="advantages-list-item">
                    <span class="img"><img src="/images/advantage-1.png" data-hover="/images/advantage-1-h.png" alt=""></span>
                    <span class="title">Арендатора</span>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="advantages-list-item item-2">
                    <span class="img"><img src="/images/advantage-2.png" data-hover="/images/advantage-2-h.png" alt=""></span>
                    <span class="title">Арендодателя</span>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="advantages-list-item">
                    <span class="img"><img src="/images/advantage-3.png" data-hover="/images/advantage-3-h.png" alt=""></span>
                    <span class="title">Покупателя</span>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="advantages-list-item">
                    <span class="img"><img src="/images/advantage-4.png" data-hover="/images/advantage-4-h.png" alt=""></span>
                    <span class="title">Продавца</span>
                </div>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="section-title"><span>Аренда квартир</span></div>
        <div class="home-catalog-list row">
            <?php
            foreach ($sale_items as $item){
                echo Items::viewitem($item);
            }
            ?>
        </div>
        <div class="text-center">
            <a href="/catalog" class="btn btn-primary">Все объявления</a>
        </div>
    </div>

    <div class="section">
        <div class="section-title"><span>Продажа квартир</span></div>
        <div class="home-catalog-list row">
            <?php
            foreach ($sale_items2 as $item){
                echo Items::viewitem($item);
            }
            ?>
        </div>
        <div class="text-center">
            <a href="/catalog" class="btn btn-primary">Все объявления</a>
        </div>
    </div>
    <div class="section">
        <div class="section-title section-title-left"><span>Новое в блоге</span></div>
        <div class="news-list row">
            <?php
            foreach ($news as $item){
                ?>
                <div class="col-sm-4 col-md-3 news-item-col">
                    <a href="/news/<?=\common\models\Helper::str2url($item['title']).'-'.$item['id']?>" class="news-item">
                        <img src="<?=\common\models\Helper::getOnePicture($item['image'])?>" alt="<?= $item['title']?>">
                        <div class="news-item-title"><?= $item['title']?></div>
                    </a>
                </div>
                <?php
            }
            ?>
        </div>
        <div class="text-center">
            <a href="/news" class="btn btn-primary">Все новости</a>
        </div>
    </div>
    <div class="section hidden-xs">
        <?php
        $about=\backend\models\Pages::findOne(5);
        ?>
        <div class="section-title"><span><?=$about['name']?></span></div>
        <div class="page-desc">
            <?=$about['text']?>
        </div>
    </div>
</div>
