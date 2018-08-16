<?php

namespace frontend\assets;

use yii\web\AssetBundle;

/**
 * Main frontend application asset bundle.
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'vendor/bootstrap/css/bootstrap.min.css',
        'vendor/jquery-ui-1.11.4/jquery-ui.min.css',
        'vendor/font-awesome-4.7.0/css/font-awesome.min.css',
        'vendor/jQueryFormStyler/jquery.formstyler.css',
        'vendor/slick/slick.css',
        '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css',
        'vendor/tooltip/tooltipster.bundle.min.css',
        'vendor/typeahead/jquery.typeahead.min.css',
        'vendor/cropper/cropper.min.css',
        'css/main.css',
        'css/site.css',
        'css/new.css',
    ];
    public $js = [
        'vendor/jquery-ui-1.11.4/jquery-ui.min.js',
        'vendor/jquery-ui-1.11.4/jquery.ui.touch-punch.min.js',
        'vendor/jQueryFormStyler/jquery.formstyler.min.js',
        'vendor/bootstrap/js/bootstrap.min.js',
        'vendor/slick/slick.min.js',
        'vendor/jquery.jLoad.js',
        'vendor/jquery.place.js',
        'vendor/mask/inputmask.js',
        'vendor/mask/jquery.inputmask.js',
        '//cdn.jsdelivr.net/npm/places.js@1.4.18',
        '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js',
        'vendor/tooltip/tooltipster.bundle.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.min.js',
        'js/socket.io.js',
        'vendor/jquery.blockUI.js',
        'vendor/typeahead/jquery.typeahead.min.js',
        'vendor/cropper/cropper.min.js',
        'vendor/share42/share42.js',
        'js/main.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
