<?php
$this->title = 'Избранное';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>'/my/favorites']);?>
        </div>
        <div class="col-md-9">
            <div class="my-box">
                <div class="title">Избранное</div>

                <?=$html?>
            </div>
        </div>
    </div>
</div>