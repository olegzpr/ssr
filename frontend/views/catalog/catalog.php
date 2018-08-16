<?php

use yii\bootstrap\Html;

$this->title = 'База квартир';
$this->params['page'] = 'catalog';

$this->registerJsFile('//maps.googleapis.com/maps/api/js?key=AIzaSyBsBxH7Lu3-agjC_EH3YjSsEdc2e9ni5MQ', ['position' => yii\web\View::POS_END]);
$this->registerJsFile('vendor/gmaps.js', ['position' => yii\web\View::POS_END]);

if (isset($_GET['view']) && $_GET['view'] == 'map') {
//начало многосточной строки, можно использовать любые кавычки
    $script = <<< JS
    map = new GMaps({
        div: '#map_catalog',
        lat: 50.463629,
        lng: 30.501860,
        zoom: 6
    });
JS;
    $this->registerJs($script, yii\web\View::POS_READY);
    foreach ($items as $item) {
        $adr = $item['address'];
        $id = $item['id'];
        $script = <<< JS
       GMaps . geocode({
          address: '$adr', 
          callback: function (results, status) {
                if (status == 'OK') {
                    var
                        latlng = results[0] . geometry . location;
                        map . addMarker({
                            lat: latlng . lat(),
                            lng: latlng . lng(),
                            click: function(e) {
                                showInfoMaps($id);
                              }
                          });
                }
            }
        });
JS;
        $this->registerJs($script, yii\web\View::POS_READY);
    }
}
$_SESSION['GET'] = json_encode(Yii::$app->request->get());
?>
<div class="container">
    <div class="breadcrumbs-wrapper">
        <ul class="breadcrumbs">
            <li>
                <a href="#">Главная</a>
                <i class="fa fa-chevron-right"></i>
            </li>
            <li>
                <span>База квартир</span>
            </li>
        </ul>
    </div>
    <div class="page-catalog">
        <div class="row">
            <div class="col-lg-3 col-md-4">
                <?php
                $form = \yii\bootstrap\ActiveForm::begin(['method' => 'get', 'options' => ['class' => 'filter-side']]);
                ?>
                <div class="clearfix filter-label-box">
                    <label>Тип объявлений:</label>
                    <div class="clearfix"></div>
                    <a href="/catalog?filter_1=1" class="first-filter-href <? if (Yii::$app->request->get('filter_1')==1) echo 'active';?>">Продажа</a>
                    <a href="/catalog?filter_1=3" class="first-filter-href <? if (Yii::$app->request->get('filter_1')==3) echo 'active';?>">Аренда</a>
                </div>
                <?
                if (isset($_GET['filter_1'])) {
                    ?>
                    <div class="clearfix  filter-label-box">
                        <label>Я ищу:</label>
                        <div class="clearfix"></div>
                        <?php
                        $values = \backend\models\RowValues::find()->where(['input_id' => 2])->all();
                        foreach ($values as $value) {
                            ?>
                            <a href="/catalog?filter_1=<?= $_GET['filter_1'] ?>&filter_2=<?= $value['value'] ?>"
                               class="first-filter-href <? if (Yii::$app->request->get('filter_2')==$value['value']) echo 'active';?>"><?= $value['label'] ?></a>
                        <?php } ?>
                    </div>
                    <?php
                }
                if (isset($_GET['filter_2'])){
                ?>
                <div class="clearfix filter-label-box">
                    <label>Тип объекта:</label>
                    <div class="clearfix"></div>
                    <?php
                    $values = \backend\models\RowValues::find()->where(['input_id' => 3, 'sub'=>Yii::$app->request->get('filter_2')])->all();
                    foreach ($values as $value) {
                        ?>
                        <a href="/catalog?filter_1=<?=$_GET['filter_1']?>&filter_2=<?=$_GET['filter_2']?>&filter_3=<?=$value['value']?>" class="first-filter-href <? if (Yii::$app->request->get('filter_3')==$value['value']) echo 'active';?>"><?=$value['label']?></a>
                    <?php } ?>
                </div>
                <?php } ?>
                <?php
                \yii\bootstrap\ActiveForm::end();
                if (isset($_GET['filter_1'])&&isset($_GET['filter_2'])&&isset($_GET['filter_3'])){
                ?>
                <div class="filter-side">
                    <div class="filter-title">
                        Разширеный поиск
                        <?php
                        echo Html::a('<i class="fa fa-times"></i>', ['catalog/reset-filter'], [
                            'data' => [
                                'method' => 'post',
                            ],
                            'class' => 'tool-tip',
                            'title' => 'Сбросить фильтры'
                        ]);
                        ?>
                        <a href="#saveFilter" data-toggle="modal" title="Сохранить набор фильтров" class="tool-tip"><i
                                    class="fa fa-heart-o"></i></a>
                    </div>
                    <?php
                    if (!empty($nabor_filters)) {
                        ?>
                        <div class="clearfix" style="margin-bottom: 10px;">
                            <?php
                            $form = \yii\bootstrap\ActiveForm::begin(['action' => '/site/apply-save-filter']);
                            ?>
                            <select class="styled-select" name="nabor" onchange="$(this).closest('form').submit();">
                                <option value="0">Сохраненные наборы</option>
                                <?php
                                foreach ($nabor_filters as $nf) {
                                    ?>
                                    <option value="<?= $nf['id'] ?>"><?= $nf['name'] ?></option>
                                <? } ?>
                            </select>
                            <?php
                            \yii\bootstrap\ActiveForm::end();
                            ?>
                        </div>
                    <? } ?>
                    <div class="clearfix" style="margin-bottom: 10px;">
                        <select class="styled-select" name="region" data-name="region" data-search="true">
                            <option>Область</option>
                            <?php
                            if (isset($_GET['city']) && $_GET['city'] != '') {
                                $selectedRegion = \backend\models\GeoCity::findOne($_GET['city']);
                            }
                            $obls = \backend\models\GeoRegion::find()->orderBy('name')->all();
                            foreach ($obls as $obl) {
                                if (isset($_GET['city']) && $obl['id'] == $selectedRegion['region']) {
                                    $select = 'selected';
                                } else {
                                    $select = '';
                                }
                                ?>
                                <option <?= $select ?> value="<?= $obl['id'] ?>"><?= $obl['name'] ?></option>
                            <? } ?>
                        </select>
                    </div>
                    <div class="clearfix" style="margin-bottom: 10px;">
                        <select class="styled-select" data-name="city" name="city" data-search="true">
                            <option>Город</option>
                            <?php
                            if (isset($_GET['city']) && $_GET['city'] != '') {
                                $values = \backend\models\GeoCity::find()->where(['region' => $selectedRegion])->orderBy('name')->all();
                                foreach ($values as $value) {
                                    $selectCity = $value['id'] == $_GET['city'] ? 'selected' : '';
                                    ?>
                                    <option <?= $selectCity ?>
                                            value="<?= $value['id'] ?>"><?= $value['name'] ?></option>
                                <?php }
                            } ?>
                        </select>
                    </div>
                    <div class="filter-content">
                        <!-- Вывод фильтров-->
                        <?php
                        $mask = '';
                        if (isset($_GET['filter_1'])) {
                            $mask .= $_GET['filter_1'];
                        } else {
                            $mask .= 0;
                        }
                        if (isset($_GET['filter_2'])) {
                            $mask .= $_GET['filter_2'];
                        } else {
                            $mask .= 0;
                        }
                        if (isset($_GET['filter_3'])) {
                            $mask .= $_GET['filter_3'];
                        } else {
                            $mask .= 0;
                        }
                        $filters = Yii::$app->db->createCommand("select * from rows where step_id in (select id from steps where mask='" . $mask . "') and id!=26 and filter=1 order by srt_filter")->queryAll();
                        //$filters=\backend\models\Rows::find()->where('id != :id and filter = :filter', ['id'=>26, 'filter'=>1])->orderBy('srt_filter')->all();
                        foreach ($filters as $filter) {
                            if ($filter['type'] == '2' || $filter['type'] == '3' || $filter['type'] == '4') {
                                ?>
                                <div class="filter-group active">
                                    <div class="filter-group-title square-arrow"><?= $filter['name'] ?></div>
                                    <div class="filter-group-container">
                                        <?php
                                        $values = \backend\models\RowValues::find()->where(['input_id' => $filter['id']])->all();
                                        foreach ($values as $value) {
                                            $checked = isset($_SESSION['filters'][$value['id']]) ? 'checked' : '';
                                            ?>
                                            <div class="styled-checkbox">
                                                <input id="ch_<?= $value['id'] ?>" <?= $checked ?>
                                                       data-toggle="filter-catalog" type="checkbox"
                                                       value="<?= $value['value'] ?>" data-filter="<?= $value['id'] ?>">
                                                <label for="ch_<?= $value['id'] ?>"><?= $value['label'] ?></label>
                                            </div>
                                        <?php } ?>
                                    </div>
                                </div>
                            <? }
                            if ($filter['type'] == 8) {
                                $start = \backend\models\ItemProp::find()->where(['row_id' => $filter['id']])->orderBy('value_int')->one()['value_int'];
                                $end = \backend\models\ItemProp::find()->where(['row_id' => $filter['id']])->orderBy('value_int DESC')->one()['value_int'];
                                $min = isset($_SESSION['filters_range'][$filter['id']]['min']) ? $_SESSION['filters_range'][$filter['id']]['min'] : $start;
                                $max = isset($_SESSION['filters_range'][$filter['id']]['max']) ? $_SESSION['filters_range'][$filter['id']]['max'] : $end;
                                ?>
                                <div class="filter-group active">
                                    <div class="filter-group-title not-collapse"><?= $filter['name'] ?></div>
                                    <div class="filter-group-container row clearfix">
                                        <div class="col-md-6 box-row-input">
                                            <span>От</span>
                                            <input type="text"
                                                   value="<?php if (isset($_SESSION['filters_range'][$filter['id']]['min'])) echo $_SESSION['filters_range'][$filter['id']]['min'] ?>"
                                                   class="filter-row js-typeahead" data-filter="<?= $filter['id'] ?>">
                                            <i class="fa fa-chevron-down"></i>
                                            <ul class="drop-head">
                                                <?php
                                                $exitValues = \backend\models\ItemProp::find()->where(['row_id' => $filter['id']])->distinct('value')->groupBy('value')->orderBy('value_int')->all();
                                                foreach ($exitValues as $ex) {
                                                    if ($ex['value'] != '') {
                                                        ?>
                                                        <li><?= $ex['value'] ?></li>
                                                    <?php }
                                                } ?>
                                            </ul>
                                        </div>
                                        <div class="col-md-6 box-row-input">
                                            <span>До</span>
                                            <input value="<?php if (isset($_SESSION['filters_range'][$filter['id']]['max'])) echo $_SESSION['filters_range'][$filter['id']]['max'] ?>"
                                                   type="text" class="filter-row js-typeahead"
                                                   data-filter="<?= $filter['id'] ?>">
                                            <i class="fa fa-chevron-down"></i>
                                            <ul class="drop-head">
                                                <?php
                                                $exitValues = \backend\models\ItemProp::find()->where(['row_id' => $filter['id']])->distinct('value')->groupBy('value')->orderBy('value_int')->all();
                                                foreach ($exitValues as $ex) {
                                                    if ($ex['value'] != '') {
                                                        ?>
                                                        <li><?= $ex['value'] ?></li>
                                                    <?php }
                                                } ?>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <?php
                            }
                        } ?>
                    </div>
                </div>
                <?php } ?>
            </div>
            <div class="col-lg-9 col-md-8">
                <div class="catalog-top">
                    <div class="catalog-top-left">
                        <div class="sortbox">
                            <select class="styled-select" id="sorting">
                                <option>По умолчанию</option>
                                <option <? if (isset($_SESSION['sorting']) && $_SESSION['sorting'] == 'in_photo') echo 'selected'; ?>
                                        value="in_photo">Сначала с фото
                                </option>
                                <option <? if (isset($_SESSION['sorting']) && $_SESSION['sorting'] == 'start_old') echo 'selected'; ?>
                                        value="start_old">Сначала старые
                                </option>
                                <option <? if (isset($_SESSION['sorting']) && $_SESSION['sorting'] == 'start_new') echo 'selected'; ?>
                                        value="start_new">Сначала новые
                                </option>
                                <option <? if (isset($_SESSION['sorting']) && $_SESSION['sorting'] == 'start_min_price') echo 'selected'; ?>
                                        value="start_min_price">Сначала дешевые
                                </option>
                                <option <? if (isset($_SESSION['sorting']) && $_SESSION['sorting'] == 'start_max_price') echo 'selected'; ?>
                                        value="start_max_price">Сначала дорогие
                                </option>
                            </select>
                        </div>
                        <div class="sortbox">
                            <select class="styled-select" id="filter-srok">
                                <option value="0">По умолчанию</option>
                                <option value="<?= date("Y-m-d 00:00:00") ?>">За сегодня</option>
                                <option value="<?= date("Y-m-d 00:00:00", strtotime("-7 days")) ?>">За неделю</option>
                                <option value="<?= date("Y-m-d 00:00:00", strtotime("-30 days")) ?>">За месяц</option>
                                <option value="0">За все время</option>
                            </select>
                        </div>
                        <div class="sortbox">
                            <select class="styled-select" id="filter-label">
                                <option value="0">Все</option>
                                <?php
                                foreach (\backend\models\Labels::find()->all() as $lab) {
                                    $class = isset($_SESSION['filter_label']) && $_SESSION['filter_label'] == $lab['id'] ? 'selected' : '';
                                    ?>
                                    <option <?= $class ?> value="<?= $lab['id'] ?>"><i
                                                class="fa <?= $lab['icon'] ?>"></i> <?= $lab['name'] ?></a></option>
                                <? } ?>
                            </select>
                        </div>
                        <div class="sortbox">
                            <select class="styled-select">
                                <option value="1">Гривны</option>
                                <option value="2">Долары</option>
                            </select>
                        </div>
                    </div>
                    <div class="catalog-top-right">
                        <ul class="catalog-view">
                            <li><a href="/catalog"
                                   class="catalog-view-list <?= !isset($_GET['view']) ? 'active' : '' ?>"><i
                                            class="fa fa-bars"></i></a></li>
                            <!--                            <li><a href="#" class="catalog-view-grid"></a></li>-->
                            <li><a href="/catalog?view=map"
                                   class="catalog-view-map <?= isset($_GET['view']) ? 'active' : '' ?>"><i
                                            class="fa fa-map-marker"></i> </a></li>
                        </ul>
                    </div>
                </div>
                <?php
                if (!isset($_GET['view'])) {
                    ?>
                    <div class="catalog-list" id="all-items"><? echo $items; ?></div>
                    <div class="text-center">
                        <a href="javascript:void(0);" data-action="load-more" data-limit="8"
                           class="btn btn-primary btn-catalog-more">Показать еще</a>
                    </div>
                    <?php
                } else if ($_GET['view'] == 'map') {
                    ?>
                    <div class="catalog-list maps_catalog" id="map_catalog"></div>
                    <?php
                }
                ?>
            </div>
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
                    <input type="hidden" name="id" value="">
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

<div id="saveFilter" class="modal modal-login fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <form id="form-save-filter">
                    <?php
                    echo Html:: hiddenInput(\Yii:: $app->getRequest()->csrfParam, \Yii:: $app->getRequest()->getCsrfToken(), []);
                    ?>
                    <div class="login-container">
                        <div class="title">Сохранение фильтров</div>
                    </div>
                    <div class="login-container">
                        <div class="login-input-row">
                            <input type="text" class="login-input" name="name" placeholder="Название набора">
                        </div>
                        <button class="btn btn-primary btn-login">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="backdoor"></div>
<div class="maps-item-box">
    <a href="#" class="close"></a>

    <div class="res">
        Подождите...
    </div>
</div>