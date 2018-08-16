<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-frontend',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'frontend\controllers',
    'language' => 'ru',
    'homeUrl' => '/',
    'components' => [
        'request' => [
            'csrfParam' => '_csrf-frontend',
            'baseUrl' => ''
        ],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
            'identityCookie' => ['name' => '_identity-frontend', 'httpOnly' => true],
        ],
        'session' => [
            // this is the name of the session cookie used for login on the frontend
            'name' => 'advanced-frontend',
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'view' => [
            'class' => '\rmrevin\yii\minify\View',
            'enableMinify' => !YII_DEBUG,
            'concatCss' => true, // concatenate css
            'minifyCss' => true, // minificate css
            'concatJs' => true, // concatenate js
            'minifyJs' => true, // minificate js
            'minifyOutput' => true, // minificate result html page
            'webPath' => '@web', // path alias to web base
            'basePath' => '@webroot', // path alias to web base
            'minifyPath' => '@webroot/minify', // path alias to save minify result
            'jsPosition' => [ \yii\web\View::POS_END ], // positions of js files to be minified
            'forceCharset' => 'UTF-8', // charset forcibly assign, otherwise will use all of the files found charset
            'expandImports' => true, // whether to change @import on content
            'compressOptions' => ['extra' => true], // options for compress
            'excludeFiles' => [

            ]
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                'add' => 'items/add',
                'add/step' => 'items/step',
                'save' => 'items/save',
                'catalog' => 'catalog/catalog',
                'catalog/map-item' => 'catalog/map-item',
                'catalog/reset-filter' => 'catalog/reset-filter',
                'ajax/more' => 'ajax/more',
                'register' => 'site/register',
                'register/varification' => 'site/varification',
                'logout' => 'site/logout',
                'catalog/<pref:[a-zA-Z0-9-_]+>' => 'catalog/item',
                'login' => 'site/login',
                'my' => 'my/index',
                'my/favorites' => 'my/favorite',
                'my/notifications' => 'my/notifications',
                'my/favorite/delete/<id:\d+>' => 'my/favorite-delete',
                'my/items/edit/<id:\d+>' => 'my/item-edit',
                'my/messages' => 'my/sms',
                'my/items/statics' => 'my/item-static',
                'ajax/dialog' => 'ajax/dialog',
                'add-to-favorite' => 'site/add-to-favorite',
                'send-sms' => 'site/send-sms',
                '<pref:[a-zA-Z0-9-_]+>' => 'site/page',
                'news/<pref:[a-zA-Z0-9-_]+>' => 'site/news',
                'users/<id:\d+>' => 'users/user-page',
                'send-code' => 'site/send-code',
            ],
        ],

    ],
    'params' => $params,
];
