<div class="item-unit" data-status="<?=$st?>">
    <div class="row clearfix">
        <div class="col-md-5">
            <div class="image">
                <img src="<?=$img?>" alt="">
            </div>
        </div>
        <div class="col-md-7 description">
            <div class="top">
                <div class="row">
                    <div class="col-md-8">
                        <div class="name"><?=$name?></div>
                    </div>
                    <div class="col-md-4">
                        <div class="price"><?=$price?></div>
                    </div>
                </div>
            </div>
            <div class="middle">
                <?=$status?>
            </div>
            <div class="bottom">
                <div class="row">
                    <div class="col-md-6">
                        <div class="add-time"><?=$date_add?></div>
                    </div>
                    <div class="col-md-6 icon-action">
                        <a href="<?=$url ?>" target="_blank"><i class="fa fa-eye"></i></a>
                        <a href="/add/step?step=<?=$minStep?>&id=<?=$id?>&mask=<?=$mask?>" target="_blank"><i class="fa fa-pencil-square-o"></i></a>
                        <a href="javascript:void(0);" onclick="items.reklama(<?=$id?>);"><i class="fa fa-arrow-circle-o-up"></i></a>
                        <a href="javascript:void(0);" onclick="items.deactive(<?=$id?>);"><i class="fa fa-times"></i></a>
                        <a href="#"><i class="fa fa-share-square-o"></i></a>
                    </div>
                </div>
                <div class="inform">
                    <button class="mini-btn"><i class="fa fa-bar-chart"></i></button>
                    <div>
                        <i class="fa fa-eye"></i>
                        Просмотры: <?=$views?>
                    </div>
                    <div>
                        <i class="fa fa-phone"></i>
                        Тел: <?=$view_phone?>
                    </div>
                    <div>
                        <i class="fa fa-heart"></i>
                        В избранное: <?=$favorite?>
                    </div>
                    <div>
                        <i class="fa fa-eye-slash"></i>
                        Скрыли: <?=$hidden?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>