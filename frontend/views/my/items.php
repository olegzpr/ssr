<?php
$this->title = 'Мои объекты';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>$activeMenu]);?>
        </div>
        <div class="col-md-9">
            <div class="my-box">
                <div class="title">Мои объекты</div>
                <ul class="tabs-ajax clearfix">
                    <li class="active"><a href="0">Все</a></li>
                    <li><a href="2">Актуальные</a></li>
                    <li><a href="1">На модерации</a></li>
                    <li><a href="3">Не активные</a></li>
                    <li><a href="4">Черновики</a></li>
                    <li><a href="5">Требуют внимания</a></li>
                </ul>

                <?=$html?>
            </div>
        </div>
    </div>
</div>