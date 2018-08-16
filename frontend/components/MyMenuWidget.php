<?php
namespace frontend\components;

use yii\base\Widget;
use yii\helpers\Html;

class MyMenuWidget extends Widget
{
    public $active;
    private $menu;

    public function init()
    {
        parent::init();
        $this->menu = [
            '/my'=>[
                'icon'=>'fa-user',
                'name'=>'Моя страница'
            ],
            '/my/items'=>[
                'icon'=>'fa-home',
                'name'=>'Мои объекты'
            ],
            '/my/bids'=>[
                'icon'=>'fa-bullhorn',
                'name'=>'Мои заявки'
            ],
            '/my/messages'=>[
                'icon'=>'fa-comments-o',
                'name'=>'Мои сообщения'
            ],
            '/my/notifications'=>[
                'icon'=>'fa-bell-o',
                'name'=>'Мои уведомления'
            ],
            '/my/favorites'=>[
                'icon'=>'fa-heart-o',
                'name'=>'Мои избранные'
            ],
            '/my/share'=>[
                'icon'=>'fa-user-plus',
                'name'=>'Пригласить друзей'
            ],
        ];
    }

    public function run()
    {
        return $this->render('menu', [
            'menus' => $this->menu,
            'active' => $this->active
        ]);
    }
}