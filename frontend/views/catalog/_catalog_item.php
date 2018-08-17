<div class="catalog-item-wrap" data-image="<?=count($image)?>" data-date="<?=$date?>" data-price="<?=$price?>">
    <div class="catalog-item">
        <div class="catalog-item-img">
            <div class="catalog-item-gallery">
                <?php
                if (count($image)>0){
                foreach ($image as $pic){
                    ?>
                    <a href="<?=$url?>" class="img"
                       style="background-image: url('<?=$pic?>')"></a>
                <? } } ?>
            </div>
        </div>
        <div class="catalog-item-desc">
            <div class="catalog-item-header">
                <div class="title"><a href="<?=$url?>"><?=$name?></a></div>
            </div>
            <div class="catalog-item-price">
                <div class="price"><a href="<?=$url?>"><?php echo frontend\components\CurrencyWidget::widget(['price'=>$price]); ?>.</a></div>
                <div class="phone" data-action="show_phone" data-phone="<?=substr($phone, 0, 13)?>"><i class="fa fa-phone"></i> <?=\common\models\Helper::getShortText($phone, 8)?></div>
            </div>
            <div class="catalog-item-text">
                <p><span class="grey">Площа -</span> <?=$place?> м2</p>
                <?php
                if ($etag!=''){
                ?>
                <p><span class="grey">Этаж -</span> <?=$etag?></p>
                <?php } ?>
<!--                <p>--><?//=$desc?><!--</p>-->
            </div>
            <div class="catalog-item-date"><?=$date_add?></div>
            <?php
            if (!\Yii::$app->user->isGuest){
            ?>
            <ul class="catalog-item-actions">
                <li>
                    <a href="javascript:void(0);" data-action="hide-in-catalog" data-id="<?=$id?>"><i class="fa fa-eye-slash"></i></a>
                </li>
                <li>
                    <a href="#" data-toggle="<?=$note['action']?>" data-id="<?=$id?>" class="write-note <?=$note['class']?>"><i class="fa fa-pencil-square-o"></i></a>
                </li>
                <li>
                    <div class="dropdown styled-dropdown">
                        <div class="dots dropdown-toggle <?=$label['class']?>" type="button" data-toggle="dropdown"><?=$label['icon']?></div>
                        <ul class="dropdown-menu">
                            <?php
                            foreach (\backend\models\Labels::find()->all() as $lab){
                            ?>
                            <li><a href="#" data-label="<?=$lab['id']?>" data-toggle="attach-label" data-id="<?=$id?>" class="ico-before"><i class="fa <?=$lab['icon']?>"></i> <?=$lab['name']?></a></li>
                            <? } ?>
                        </ul>
                    </div>
                </li>
                <?php
                if (\frontend\models\Items::getFavorite($id)){
                    ?>
                    <li><a href="javascript:void(0);" class="catalog-item-like active" data-action="add-to-favorite" data-id="<?=$id?>"><i class="fa fa-heart"></i></a></li>
                    <?php
                } else {
                    ?>
                    <li><a href="javascript:void(0);" data-action="add-to-favorite" data-id="<?=$id?>" class="catalog-item-like"><i class="fa fa-heart-o"></i></a></li>
                <?php } ?>
                <li><a href="#" data-toggle="write-complain" data-id="<?=$id?>"><i class="fa fa-flag-o"></i></a></li>
            </ul>
            <? } ?>
        </div>
    </div>
</div>