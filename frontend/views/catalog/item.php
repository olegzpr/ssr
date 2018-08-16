<?php

use common\models\Helper;

$name = Helper::titleFormatItem($model['id']);
$this->title = $name;
$this->params['page'] = 'catalog';

$this->registerJsFile('//maps.googleapis.com/maps/api/js?key=AIzaSyBsBxH7Lu3-agjC_EH3YjSsEdc2e9ni5MQ',  ['position' => yii\web\View::POS_END]);
$this->registerJsFile('/vendor/gmaps.js',  ['position' => yii\web\View::POS_END]);


$sess = Yii::$app->session;
$uid = $sess->getId();
$exits = \backend\models\ItemStatics::findOne(['item_id' => $model['id'], 'type' => 'view', 'session' => $uid]);
if (empty($exits)) {
    $static = new \backend\models\ItemStatics();
    $static->item_id = $model['id'];
    $static->type = 'view';
    $static->session = $uid;
    $static->save();
}

use yii\bootstrap\Html;

?>
<div id="writeSms" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <form action="/send-sms" method="post">
                    <?php
                    echo Html:: hiddenInput(\Yii:: $app->getRequest()->csrfParam, \Yii:: $app->getRequest()->getCsrfToken(), []);
                    ?>
                    <div class="login-container">
                        <div class="title">Сообщение пользователю</div>
                    </div>
                    <div class="login-container">
                        <?php
                        if (Yii::$app->user->isGuest) {
                            ?>
                            <div class="login-input-row">
                                <input type="text" class="login-input" name="username"
                                       placeholder="Введите ваш номер телефона">
                            </div>
                        <? } else {
                            ?>
                            <input type="hidden" class="login-input" name="username"
                                   value="<?= Yii::$app->user->identity->username ?>">
                            <?php
                        }
                        ?>
                        <!--                        <input type="hidden" value="-->
                        <? //=$model['phone']?><!--" name="user_to">-->
                        <div class="login-input-row">
                            <textarea class="login-area" name="text" rows="5" placeholder="Сообщение"></textarea>
                        </div>
                        <button class="btn btn-primary btn-login">Написать</button>
                    </div>
                </form>
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
                    echo Html:: hiddenInput(\Yii:: $app->getRequest()->csrfParam, \Yii:: $app->getRequest()->getCsrfToken(), []);
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
                    echo Html:: hiddenInput(\Yii:: $app->getRequest()->csrfParam, \Yii:: $app->getRequest()->getCsrfToken(), []);
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
<div class="container">
    <div class="breadcrumbs-wrapper">
        <ul class="breadcrumbs">
            <li>
                <a href="/">Главная</a>
                <i class="fa fa-chevron-right"></i>
            </li>
            <li>
                <a href="/catalog">База квартир</a>
                <i class="fa fa-chevron-right"></i>
            </li>
            <li>
                <a href="#" class="active"><?= $name ?></a>
                <span></span>
            </li>
        </ul>
    </div>
    <div class="page-card">
        <div class="row">
            <div class="col-lg-9 col-md-8">
                <div class="card-header">
                    <div class="title">
                        <h1><?= $name ?></h1>
                    </div>
                    <?php
                    $date = new \DateTime($model['date_create']);
                    ?>
                    <div class="row clearfix">
                        <div class="col-md-6">
                            <div class="address">
                                <?php
                                $address = '';
                                if ($model['city']!=''){
                                    $address.=\backend\models\GeoCity::findOne($model['city'])['name'].', ';
                                }
                                if ($model['region']!=''){
                                    $address.=\backend\models\GeoRegion::findOne($model['region'])['name'].' область, ';
                                }
                                if ($model['area']!=''){
                                    $address.=\backend\models\GeoArea::findOne($model['area'])['name'].', ';
                                }

                                echo substr($address, 0, -2);
                                ?>
                                <input type="hidden" value="<?=$address?>" id="address">
                            </div>
                        </div>
                        <div class="col-md-6 text-right">
                            <div class="date" style="margin-bottom: 20px;">Опубликовано: <?= $date->format("d/m/Y") ?>
                                в <?= $date->format("H:i") ?> <img src="/images/card-right-info-1.png"
                                                                   class="item-active" alt=""></div>
                        </div>
                    </div>
                </div>
                <div class="card-media">
                    <ul class="tab-buttons card-media-btn">
                        <li><a href="#" class="tab-btn active" data-target="#media1">Фото и планировка</a></li>
                        <li><a href="#" class="tab-btn" onclick="loadMaps();" data-target="#media2">Показать на
                                карте</a></li>
                        <li><a href="#" class="tab-btn" data-target="#media3">Видео</a></li>
                        <li><a href="#" class="tab-btn" data-target="#media4">3D тур</a></li>
                        <li><a href="#" class="tab-btn" onclick="loadPan();" data-target="#media5">Панорама улицы</a>
                        </li>
                    </ul>
                    <div class="tab-container">
                        <div class="tab-content active" data-tab="#media1">
                            <div class="card-media-gallery">
                                <div class="catalog-item-gallery">
                                    <?php
                                    $images = \frontend\models\Items::getPropLabel($model['id'], '_photo_');
                                    if ($images != '') {
                                        foreach (\common\models\Helper::getPicture($images) as $pic) {
                                            ?>
                                            <a href="#" class="img" style="background-image: url('<?= $pic ?>')"></a>
                                            <?php
                                        }
                                    }

                                    $images = \frontend\models\Items::getPropLabel($model['id'], '_plans_');
                                    if ($images != '') {
                                        foreach (\common\models\Helper::getPicture($images) as $pic) {
                                            ?>
                                            <a href="#" class="img" style="background-image: url('<?= $pic ?>')"></a>
                                            <?php
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                        <div class="tab-content" data-tab="#media2">
                            <div id="map" style="height: 475px;"></div>
                        </div>
                        <div class="tab-content" data-tab="#media3">
                            <?php
                            $code = explode('=', \frontend\models\Items::getPropLabel($model['id'], '_youtube_'));
                            ?>
                            <iframe width="100%" height="475" src="https://www.youtube.com/embed/<?= array_pop($code) ?>" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
                        </div>
                        <!--                        <div class="tab-content" data-tab="#media4">3D тур</div>-->
                        <div class="tab-content" data-tab="#media5">
                            <div id="panorama" style="height: 475px;"></div>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-info-title"><span>О квартире</span></div>
                    <div class="clearfix">
                        <div class="card-info-col">
                            <ul class="card-info-about">
                                <?php
                                $rows = \backend\models\ItemProp::find()->where(['AND', ['item_id' => $model['id']], ['NOT IN', 'row_id', [29, 18, 1, 2, 3, 4, 5, 6, 24, 25, 45, 46, 47, 48]]])->all();
                                foreach ($rows as $row) {
                                    $prop = \backend\models\Rows::findOne($row['row_id']);
                                    ?>
                                    <li>
                                        <span><i class="fa fa-check"></i><?= $prop['name'] ?>:</span>
                                        <strong>
                                            <?php
                                            if (is_array($row['value'])) {
                                                foreach ($row['value'] as $ts) {
                                                    ?>
                                                    <div><?php echo \backend\models\RowValues::find()->where(['input_id' => $row['id'], 'value' => $ts])->one()['label'] ?></div>
                                                    <?php
                                                }
                                            } else {
                                                if ($prop['type'] == 2) {
                                                    echo \backend\models\RowValues::find()->where(['input_id' => $row['row_id'], 'value' => $row['value']])->one()['label'];
                                                } else if ($prop['type'] == 3) {
                                                    $checkbox = \backend\models\RowValues::find()->where(['input_id' => $row['row_id'], 'value' => $row['value']])->one();
                                                    if (empty($checkbox)) {
                                                        echo '<i class="fa fa-times"></i>';
                                                    } else {
                                                        echo '<i class="fa fa-check"></i>';
                                                    }
                                                } else {
                                                    echo $row['value'];
                                                }
                                            }
                                            ?>
                                        </strong>
                                    </li>
                                <? } ?>
                            </ul>
                        </div>
                    </div>

                    <?php
                    $rows = \backend\models\ItemProp::find()->where(['AND', ['item_id' => $model['id']], ['row_id'=>45]])->all();
                    if (count($rows)>0){
                    ?>
                    <div class="card-info-title"><span>Комфорт</span></div>
                    <div class="clearfix">
                        <div class="card-info-col">
                            <ul class="card-info-about">
                                <?php
                                foreach ($rows as $row) {
                                    $vals = explode(',', $row['value']);
                                    foreach ($vals as $val){
                                    ?>
                                    <li>
                                        <span><i class="fa fa-check"></i><?= trim($val) ?></span>
                                    </li>
                                    <?php } ?>
                                <? } ?>
                            </ul>
                        </div>
                    </div>
                    <?php }

                    $rows = \backend\models\ItemProp::find()->where(['AND', ['item_id' => $model['id']], ['row_id'=>46]])->all();
                    if (count($rows)>0){
                    ?>
                    <div class="card-info-title"><span>Коммуникации</span></div>
                    <div class="clearfix">
                        <div class="card-info-col">
                            <ul class="card-info-about">
                                <?php
                                foreach ($rows as $row) {
                                    $vals = explode(',', $row['value']);
                                    foreach ($vals as $val){
                                    ?>
                                    <li>
                                        <span><i class="fa fa-check"></i><?= trim($val) ?></span>
                                    </li>
                                    <?php } ?>
                                <? } ?>
                            </ul>
                        </div>
                    </div>
                    <?php } ?>
                </div>
                <div class="card-info">
                    <div class="card-info-title"><span>Описание</span></div>
                    <div class="clearfix">
                        <div class="card-info-col">
                            <p class="desc-item">
                                <?=\backend\models\ItemProp::findOne(['item_id'=>$model['id'], 'row_id'=>18])['value'];?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-4">
                <div class="card-right-container">
                    <div class="card-right-price-container">
                        <?php
                        $price = \frontend\models\Items::getPropLabel($model['id'], '_price_');
                        $currency = \frontend\models\Items::getPropLabel($model['id'], '_currency_');
                        $kurs = \backend\models\Settings::findOne(1)['value'];
                        if ($currency == 'Гривна') {
                            $price = $price;
                            $price_usd = $price / $kurs;
                        } else {
                            $price_usd = $price;
                            $price = $price * $kurs;
                        }
                        ?>
                        <div class="card-right-price" id="price-box" data-usd="<?= $price_usd ?>"
                             data-uah="<?= $price ?>">
                            <?= $price ?><span>грн <i class="fa fa-chevron-down"></i></span>
                        </div>
                        <div class="card-right-price-per">
                            <?php
                            $place = \frontend\models\Items::getPropLabel($model['id'], '_place_');
                            if (!empty($place)) {
                                echo round($price / $place, 0);
                            }
                            ?>
                            грн/м<sup>2</sup></div>
                    </div>
                </div>
                <div class="card-right">
                    <div class="card-right-section">
                        <div class="card-right-container">

                            <div class="card-right-user">
                                <?php
                                $author = \common\models\User::findOne($model['user']);
                                if (!empty($author)){
                                ?>
                                <div class="right"><img src="<?php echo json_decode($author['photo'])[0] ?>" alt=""></div>
                                <?php } else { ?>
                                    <div class="right">
                                        <div class="leter-photo">
                                            <?=mb_substr($username, 0, 1);?>
                                        </div>
                                    </div>
                                <?php } ?>
                                <div class="left" <? if (empty($author)) echo 'style="margin-bottom:20px;"';?>>
                                    <div class="name"><a href="#"><?= $username ?></a></div>
                                    <?php
                                    if (!empty($author)){
                                        ?>
                                        <div class="company">Частное лицо</div>
                                        <div class="time-reg"><i
                                                    class="fa fa-clock-o"></i> <?= date("d.m.Y", strtotime($author['created_at'])) ?>
                                        </div>
                                    <?php } else {
                                        ?>
                                        <div class="time-reg"> Добавлено роботом
                                        </div>
                                        <?php
                                    } ?>
                                </div>
                            </div>
                            <a href="javascript:void(0);" data-phone="<?= \frontend\models\Items::getPropLabel($model['id'], '_phone_') ?>"
                               onclick="$(this).text($(this).attr('data-phone'));items.viewphone(<?= $model['id'] ?>);"
                               class="btn btn-primary"><i class="fa fa-phone"></i> Показать телефон</a>
                                <?php
                                if ($model['source']==1){
                                ?>
                            <a href="#writeSms" data-toggle="modal" class="btn btn-primary"><i
                                        class="fa fa-pencil-square-o"></i> Написать автору</a>
                                <?php } ?>
                            <ul class="card-right-actions">
                                <li>
                                    <a href="#writeNote" data-toggle="modal">
                                        <i class="fa fa-pencil-square-o"></i>
                                        Написать заметку
                                    </a>
                                </li>
                                <li class="item-drop-label">
                                    <div class="dropdown styled-dropdown">
                                        <?php
                                        $uid=Yii::$app->user->isGuest?Yii::$app->session->hasSessionId:Yii::$app->user->identity->id;
                                        $label = \backend\models\LabelItems::find()->where(['item_id' => $model['id'], 'user_id' => $uid])->one();
                                        if (!empty($label)) {
                                            $label_class = 'active';
                                            $label_info = \backend\models\Labels::findOne($label['label_id']);
                                            $label_icon = '<a href="#"><i class="fa ' . $label_info['icon'] . '"></i> '.$label_info['name'].'</a>';
                                        } else {
                                            $label_class = '';
                                            $label_icon = '<a href="#"><i class="fa fa-bookmark-o"></i> Добавить метку</a>';
                                        }
                                        ?>
                                        <div class="dots dropdown-toggle <?=$label_class?>" type="button" data-toggle="dropdown"><?=$label_icon?></div>
                                        <ul class="dropdown-menu">
                                            <?php
                                            foreach (\backend\models\Labels::find()->all() as $lab){
                                                ?>
                                                <li><a href="#" data-label="<?=$lab['id']?>" data-toggle="attach-label-with-text" data-id="<?=$model['id']?>" class="ico-before"><i class="fa <?=$lab['icon']?>"></i> <?=$lab['name']?></a></li>
                                            <? } ?>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <a href="#complain" data-toggle="modal">
                                        <i class="fa fa-flag-o"></i>
                                        Сообщить о нарушении
                                    </a>
                                </li>
                                <li>
                                    <a href="#writeSms" data-toggle="modal">
                                        <i class="fa fa-eye-slash"></i>
                                        Больше не показывать
                                    </a>
                                </li>
                                <li class="item-drop-label">
                                    <div class="dropdown styled-dropdown">
                                        <div class="dots dropdown-toggle" type="button" data-toggle="dropdown">
                                            <a href="#">
                                                <i class="fa fa-share-square-o"></i>
                                                Отправить ссылку
                                            </a>
                                        </div>
                                        <ul class="dropdown-menu">
                                            <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
                                                <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
                                                <a class="a2a_button_facebook"></a>
                                                <a class="a2a_button_twitter"></a>
                                                <a class="a2a_button_google_plus"></a>
                                                <a class="a2a_button_pinterest"></a>
                                                <a class="a2a_button_email"></a>
                                                <a class="a2a_button_whatsapp"></a>
                                                <a class="a2a_button_copy_link"></a>
                                            </div>
                                            <script async src="https://static.addtoany.com/menu/page.js"></script>
                                        </ul>
                                    </div>
                                </li>
                                <?php
                                if (!\frontend\models\Items::getFavorite($model['id'])){
                                    ?>
                                    <li><a href="javascript:void(0);" data-action="add-to-favorite-with-text" data-id="<?= $model['id']?>"><i class="fa fa-heart-o"></i> Добавить в избранное</a></li>
                                    <?php
                                } else { ?>
                                    <li class="active"><a href="javascript:void(0);" data-action="add-to-favorite-with-text" data-id="<?= $model['id']?>"><i class="fa fa-heart"></i> В избранном</a></li><?php } ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-action">
            <a href="<?=Yii::$app->request->referrer?>" class="prev"><i class="fa fa-long-arrow-left"></i> Назад к поиску</a>
            <a href="#" class="next">Следующее объявление <i class="fa fa-long-arrow-right"></i></a>
        </div>
    </div>
</div>

<div id="complain" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <form id="form-complain">
                    <?php
                    echo Html:: hiddenInput(\Yii:: $app->getRequest()->csrfParam, \Yii:: $app->getRequest()->getCsrfToken(), []);
                    ?>
                    <input type="hidden" name="id" value="<?=$model['id']?>">
                    <div class="login-container">
                        <div class="title">Жалоба</div>
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