<?php
$this->params['page']='';
$this->title='Личный кабинет';
?>
<div class="crop-image">
    <img src="">
    <div class="bottom-crop">
        <button class="btn btn-success" id="save-ava">Сохранить</button>
        <button class="btn btn-danger" onclick="$('.crop-image, .backdoor').fadeOut();$('.crop-image img').cropper('destroy')">Отмена</button>
    </div>
</div>

<div class="crop-image2">
    <img src="">
    <div class="bottom-crop">
        <button class="btn btn-success" id="save-cover">Сохранить</button>
        <button class="btn btn-danger" onclick="$('.crop-image2, .backdoor').fadeOut();$('.crop-image2 img').cropper('destroy')">Отмена</button>
    </div>
</div>
<div class="backdoor"></div>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-3">
            <?=\frontend\components\MyMenuWidget::widget(['active'=>'/my']);?>
        </div>
        <div class="col-md-9">
            <div class="cover" style="background: url('<?=\common\models\Helper::getOnePicture(Yii::$app->user->identity->cover)?>') no-repeat center center/cover">
                <a href="javascript:void(0);" class="change-cover" onclick="$('#upload-cover').click();"><i class="fa fa-camera"></i> Изменить обложку</a>
                <a href="/users/<?=Yii::$app->user->identity->id?>" target="_blank" class="view-page"><i class="fa fa-eye"></i> Просмотр страницы</a>
                <input type="file" id="upload-cover" class="hidden">
            </div>

            <div class="sub-navs">
                <div class="row clearfix">
                    <div class="col-md-4">
                        <div class="avatar">
                            <img src="<?=\common\models\Helper::getOnePicture(Yii::$app->user->identity->photo, true)?>" alt="<?=Yii::$app->user->identity->name?>" alt="<?=Yii::$app->user->identity->name?>" id="user-avatar">
                            <a href="javascript:void(0);" onclick="$('#upload-avatar').click();"><i class="fa fa-camera"></i></a>
                            <input type="file" id="upload-avatar" class="hidden">
                        </div>
                    </div>
                    <div class="col-md-8">
                        <ul class="clearfix">
                            <li class="active"><a href="#tab1" data-toggle="tabs-page">Основное</a></li>
                            <li><a href="#tab2" data-toggle="tabs-page">Контакты</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="box-index active" id="tab1">
                <?php
                $form = \yii\bootstrap\ActiveForm::begin(['options'=>['class'=>'field']]);
                ?>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-user"></i>
                            Имя:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="row clearfix">
                            <div class="col-md-6">
                                <div class="rows-relative"><input type="text" name="User[name]" value="<?=Yii::$app->user->identity->name?>" required class="form-control"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-user"></i>
                            Фамилия:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="row clearfix">
                            <div class="col-md-6">
                                <div class="rows-relative"><input type="text" name="User[lastname]" value="<?=Yii::$app->user->identity->lastname?>" class="form-control"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-user"></i>
                            Отчество:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="row clearfix">
                            <div class="col-md-6">
                                <div class="rows-relative"><input type="text" name="User[middlename]" value="<?=Yii::$app->user->identity->middlename?>" class="form-control" placeholder=""></div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-lock"></i>
                            Новый пароль:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="row clearfix">
                            <div class="col-md-6">
                                <div class="rows-relative"><input type="text" name="User[pass]" value="" class="form-control" placeholder=""></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-lock"></i>
                            Новый пароль еще раз:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="row clearfix">
                            <div class="col-md-6">
                                <div class="rows-relative"><input type="text" name="User[pass2]" value="" class="form-control" placeholder=""></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-group box-group-min row clearfix">
                    <div class="col-md-8 col-md-offset-4">
                        <button class="btn btn-success">Сохранить</button>
                    </div>
                </div>
                <?php
                \yii\bootstrap\ActiveForm::end();
                ?>
            </div>
            <div class="box-index" id="tab2">
                <div class="box-group row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-phone"></i>
                            Мобильные телефоны:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <?php
                        $phones = \backend\models\Contacts::find()->where(['type'=>1, 'user'=>Yii::$app->user->identity->id])->all();
                        foreach ($phones as $phone){
                            if ($phone['params']!='') {
                                $apps = json_decode($phone['params']);
                            } else {
                                $apps = [];
                            }
                        ?>
                        <div class="field" data-type="phone">
                            <div class="row clearfix">
                                <div class="col-md-4">
                                    <input type="text" value="<?=$phone['value']?>" class="form-control" data-inputmask="'mask': '+38 (999) 999-99-99'">
                                </div>
                                <div class="col-md-5">
                                    <p>По указанному телефону я доступен в мессенжерах: </p>
                                </div>
                                <div class="col-md-3">
                                    <a href="#" class="active-app <?php if (in_array('telegram', $apps)) echo 'active'; ?>" data-app="telegram"><i class="fa fa-telegram"></i></a>
                                    <a href="#" class="active-app <?php if (in_array('whatsapp', $apps)) echo 'active'; ?>" data-app="whatsapp"><i class="fa fa-whatsapp"></i></a>
                                </div>
                            </div>
                            <a href="#" class="add-more" data-clone="phone"><i class="fa fa-plus"></i> Добавить другой номер телефона</a>
                        </div>
                        <?php }
                        if (count($phones)==0){
                            ?>
                            <div class="field" data-type="phone">
                                <div class="row clearfix">
                                    <div class="col-md-4">
                                        <input type="text" value="" class="form-control" data-inputmask="'mask': '+38 (999) 999-99-99'">
                                    </div>
                                    <div class="col-md-5">
                                        <p>По указанному телефону я доступен в мессенжерах: </p>
                                    </div>
                                    <div class="col-md-3">
                                        <a href="#" class="active-app" data-app="telegram"><i class="fa fa-telegram"></i></a>
                                        <a href="#" class="active-app" data-app="whatsapp"><i class="fa fa-whatsapp"></i></a>
                                    </div>
                                </div>
                                <a href="#" class="add-more" data-clone="phone"><i class="fa fa-plus"></i> Добавить другой номер телефона</a>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                </div>

                <div class="box-group row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa fa-envelope-o"></i>
                            Электронная почта:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <?php
                        $emails = \backend\models\Contacts::find()->where(['user'=>Yii::$app->user->identity->id, 'type'=>2])->all();
                        foreach ($emails as $email){
                        ?>
                        <div class="field" data-type="email">
                            <div class="row clearfix">
                                <div class="col-md-6">
                                    <input type="email" value="<?=$email['value']?>" class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <select class="styled-select">
                                        <option value="lock" <?php if ($email['params']=='lock') echo 'selected';?>><i class="fa fa-lock"></i> Не показывать</option>
                                        <option value="unlock" <?php if ($email['params']=='unlock') echo 'selected';?>><i class="fa fa-unlock"></i> Показывать</option>
                                    </select>
                                </div>
                            </div>
                            <a href="#" class="add-more" data-clone="email"><i class="fa fa-plus"></i> Добавить другой электронный адрес</a>
                        </div>
                        <?php }
                        if (count($emails)==0){
                            ?>
                            <div class="field" data-type="email">
                                <div class="row clearfix">
                                    <div class="col-md-6">
                                        <input type="email" value="" class="form-control">
                                    </div>
                                    <div class="col-md-4">
                                        <select class="styled-select">
                                            <option value="lock"><i class="fa fa-lock"></i> Не показывать</option>
                                            <option value="unlock"><i class="fa fa-unlock"></i> Показывать</option>
                                        </select>
                                    </div>
                                </div>
                                <a href="#" class="add-more" data-clone="email"><i class="fa fa-plus"></i> Добавить другой электронный адрес</a>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                </div>

                <div class="box-group row clearfix">
                    <div class="col-md-4">
                        <div class="label">
                            <i class="fa share-square-o"></i>
                            Ссылки на профили в сети:
                        </div>
                    </div>
                    <div class="col-md-8">
                        <?php
                        $socs = \backend\models\Contacts::find()->where(['type'=>3, 'user'=>Yii::$app->user->identity->id])->all();
                        foreach ($socs as $soc){
                            $param = json_decode($soc['params']);
                        ?>
                        <div class="field" data-type="soc">
                            <div class="row clearfix">
                                <div class="col-md-6">
                                    <input type="email" value="<?=$soc['value']?>" class="form-control">
                                </div>
                                <div class="col-md-6">
                                    <div class="row clearfix">
                                        <div class="col-md-6">
                                            <select class="styled-select" name="soc_name">
                                                <option value="facebook" <?php if ($param->name=='facebook') echo 'selected'; ?>>Facebook</option>
                                                <option value="instagram" <?php if ($param->name=='instagram') echo 'selected'; ?>>Instagram</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <select class="styled-select" name="allow">
                                                <option value="lock" <?php if ($param->allow=='lock') echo 'selected'; ?>><i class="fa fa-lock"></i> Не показывать</option>
                                                <option value="unlock" <?php if ($param->allow=='unlock') echo 'selected'; ?>><i class="fa fa-unlock"></i> Показывать</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a href="#" class="add-more" data-clone="soc"><i class="fa fa-plus"></i> Добавить ещё одну ссылку на профиль в сети</a>
                        </div>
                        <?php }
                        if (count($socs)==0){
                            ?>
                            <div class="field" data-type="soc">
                                <div class="row clearfix">
                                    <div class="col-md-6">
                                        <input type="email" value="" class="form-control">
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row clearfix">
                                            <div class="col-md-6">
                                                <select class="styled-select" name="soc_name">
                                                    <option value="facebook">Facebook</option>
                                                    <option value="instagram">Instagram</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <select class="styled-select" name="allow">
                                                    <option value="lock"><i class="fa fa-lock"></i> Не показывать</option>
                                                    <option value="unlock"><i class="fa fa-unlock"></i> Показывать</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" class="add-more" data-clone="soc"><i class="fa fa-plus"></i> Добавить ещё одну ссылку на профиль в сети</a>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                </div>

                <hr>

                <div class="turn-on-off-soc">
                    <p>Чтобы загрузить фото и другую информацию из социальных сетей
                        привяжите свою страницу к аккаунтам в социальных сетях:</p>

                    <div class="line-soc">
                        <div class="row clearfix">
                            <div class="col-md-3">
                                <i class="fa fa-facebook"></i>
                                Facebook
                            </div>
                            <div class="col-md-3">
                                <div class="turn-on">
                                    Подключено
                                    <i class="fa fa-chevron-down"></i>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="turn-off">
                                    Отключено
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="line-soc">
                        <div class="row clearfix">
                            <div class="col-md-3">
                                <i class="fa fa-twitter"></i>
                                Twitter
                            </div>
                            <div class="col-md-3">
                                <div class="turn-off">
                                    Подключено
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="turn-on">
                                    Отключено
                                    <i class="fa fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div class="text-center"><button class="btn btn-success" type="button" id="save-contacts">Сохранить</button></div>
            </div>
        </div>
    </div>
</div>
