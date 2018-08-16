<?php

namespace backend\assets;

use yii\web\AssetBundle;

/**
 * Main backend application asset bundle.
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'font-awesome/css/font-awesome.css',
        'css/animate.css',
        'css/plugins/toastr/toastr.min.css',
        'js/plugins/gritter/jquery.gritter.css',
        'css/plugins/iCheck/custom.css',
        'css/plugins/sweetalert/sweetalert.css',
        'css/plugins/jQueryUI/jquery-ui.css',
        'css/plugins/select2/select2.min.css',
        'css/plugins/codemirror/codemirror.css',
        'fancybox3/jquery.fancybox.min.css',
        'bootstrap-tour/build/css/bootstrap-tour.css',
        'bootstrap-tour/build/css/bootstrap-tour-standalone.min.css',
        'css/style.css',
        'css/site.css',
    ];
    public $js = [
        'js/bootstrap.min.js',
        'js/plugins/metisMenu/jquery.metisMenu.js',
        'js/plugins/slimscroll/jquery.slimscroll.min.js',
        'js/inspinia.js',
        'js/plugins/pace/pace.min.js',
        'js/plugins/jquery-ui/jquery-ui.min.js',
        'js/plugins/toastr/toastr.min.js',
        'js/plugins/flot/jquery.flot.js',
        'js/plugins/flot/jquery.flot.tooltip.min.js',
        'js/plugins/flot/jquery.flot.spline.js',
        'js/plugins/flot/jquery.flot.resize.js',
        'js/plugins/flot/jquery.flot.pie.js',
        'js/plugins/chartJs/Chart.min.js',
        'js/plugins/sweetalert/sweetalert.min.js',
        'js/plugins/jquery-ui/jquery-ui.min.js',
        'js/plugins/select2/select2.full.min.js',
        'js/plugins/iCheck/icheck.min.js',
        'js/plugins/codemirror/codemirror.js',
        'js/tinymce/jquery.tinymce.min.js',
        'fancybox3/jquery.fancybox.min.js',
        'js/plugins/sparkline/jquery.sparkline.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js',
        'bootstrap-tour/build/js/bootstrap-tour.js',
        'bootstrap-tour/build/js/bootstrap-tour-standalone.min.js',
        'js/main.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
