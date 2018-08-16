<?php
$this->title = 'Мои заявки';
?>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>'/my/bids']);?>
        </div>
        <div class="col-md-9">
            <div class="my-box">
                <div class="title">Мои заявки</div>
                <ul class="tabs-ajax clearfix">
                    <li><a href="#">Актуальные</a></li>
                    <li class="active"><a href="#">Ожидающие</a></li>
                    <li><a href="#">Неактуальные</a></li>
                </ul>

                <div class="item-unit">
                    <div class="row clearfix">
                        <div class="col-md-5">
                            <div class="image">
                                <img src="/images/slice-1.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-7 description">
                            <div class="top">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="name">Продам 2х-комнатную квартиру
                                            Ковель, ул. Победы 10</div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="price">780000 грн.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="middle">
                                <div class="success"><i class="fa fa-check"></i> Объявление скоро появится на сайте</div>
                            </div>
                            <div class="bottom">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="add-time">Добавлено: 2 часа назад</div>
                                    </div>
                                    <div class="col-md-6 icon-action">
                                        <a href="#"><i class="fa fa-line-chart"></i></a>
                                        <a href="#"><i class="fa fa-eye"></i></a>
                                        <a href="#"><i class="fa fa-pencil-square-o"></i></a>
                                        <a href="#"><i class="fa fa-arrow-circle-o-up"></i></a>
                                        <a href="#"><i class="fa fa-times"></i></a>
                                        <a href="#"><i class="fa fa-share-square-o"></i></a>
                                    </div>
                                </div>
                                <div class="inform">
                                    <button class="mini-btn"><i class="fa fa-bar-chart"></i></button>
                                    <div>
                                        <i class="fa fa-eye"></i>
                                        Просмотры: 28
                                    </div>
                                    <div>
                                        <i class="fa fa-phone"></i>
                                        Тел: 15
                                    </div>
                                    <div>
                                        <i class="fa fa-heart"></i>
                                        В избранное: 15
                                    </div>
                                    <div>
                                        <i class="fa fa-eye-slash"></i>
                                        Скрыли: 1
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="item-unit">
                    <div class="row clearfix">
                        <div class="col-md-5">
                            <div class="image">
                                <img src="/images/slice-1.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-7 description">
                            <div class="top">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="name">Продам 2х-комнатную квартиру
                                            Ковель, ул. Победы 10</div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="price">780000 грн.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="middle">
                                <div class="error"><i class="fa fa-times-circle"></i> Модератор отменил публикацию, внесите изменения
                                </div>
                            </div>
                            <div class="bottom">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="add-time">Добавлено: 2 часа назад</div>
                                    </div>
                                    <div class="col-md-6 icon-action">
                                        <a href="#"><i class="fa fa-line-chart"></i></a>
                                        <a href="#"><i class="fa fa-eye"></i></a>
                                        <a href="#"><i class="fa fa-pencil-square-o"></i></a>
                                        <a href="#"><i class="fa fa-arrow-circle-o-up"></i></a>
                                        <a href="#"><i class="fa fa-times"></i></a>
                                        <a href="#"><i class="fa fa-share-square-o"></i></a>
                                    </div>
                                </div>
                                <div class="inform">
                                    <button class="mini-btn"><i class="fa fa-bar-chart"></i></button>
                                    <div>
                                        <i class="fa fa-eye"></i>
                                        Просмотры: 28
                                    </div>
                                    <div>
                                        <i class="fa fa-phone"></i>
                                        Тел: 15
                                    </div>
                                    <div>
                                        <i class="fa fa-heart"></i>
                                        В избранное: 15
                                    </div>
                                    <div>
                                        <i class="fa fa-eye-slash"></i>
                                        Скрыли: 1
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>