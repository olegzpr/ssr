<?php
namespace backend\widget;

use yii\base\Widget;
use yii\helpers\Html;

class Menu extends Widget
{
    private $menu;
    public $active;

    public function init()
    {
        parent::init();

        $tmp=explode('?', $this->active);
        $tmp=explode('/', $tmp[0]);
        $this->active=!isset($tmp[2])?'':'/'.$tmp[2];

        $arr=[
            [
                'name'=>'Главная',
                'pref'=>'',
                'icon'=>'fa-home'
            ],
            [
                'name'=>'База недвижимости',
                'pref'=>'items',
                'icon'=>'fa-file-o'
            ],
            [
                'name'=>'Жалобы',
                'pref'=>'complains',
                'icon'=>'fa-flag-o'
            ],
            [
                'name'=>'Шаги',
                'pref'=>'steps',
                'icon'=>'fa-line-chart'
            ],
            [
                'name'=>'Поля',
                'pref'=>'rows',
                'icon'=>'fa-bars'
            ],
            [
                'name'=>'Значения',
                'pref'=>'row_values',
                'icon'=>'fa-font'
            ],
            [
                'name'=>'Новости',
                'pref'=>'news',
                'icon'=>'fa-newspaper-o'
            ],
            [
                'name'=>'Страницы',
                'pref'=>'pages',
                'icon'=>'fa-file-o'
            ],
            [
                'name'=>'Оповещения',
                'pref'=>'system_notifications',
                'icon'=>'fa-bell'
            ]
        ];

        foreach ($arr as $row){
            $sub=[];
            if (!empty($row['sub'])){
	            foreach ($row['sub'] as $k=>$v){
	                array_push($sub, $k);
	            }
            }
            $class=$this->active==$row['pref']||in_array($this->active, $sub)?'active':'';
            if (!empty($row['sub'])){
                $this->menu.='<li class="'.$class.'"><a href="#"><i class="fa fa-bar-chart-o"></i> <span class="nav-label">'.$row['name'].'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse"><li><a href="'.\Yii::$app->homeUrl.$row['pref'].'">'.$row['name'].'</a></li>';
                foreach ($row['sub'] as $key=>$value) {
                    $this->menu .= '<li><a href="'.\Yii::$app->homeUrl.$key.'">'.$value.'</a></li>';
                }

                $this->menu.='</ul></li>';
            } else {
                $this->menu .= '<li class="' . $class . '"><a href="' . \Yii::$app->homeUrl . $row['pref'] . '"><i class="fa ' . $row['icon'] . '"></i> <span class="nav-label">' . $row['name'] . '</span></a></li>';

            }
        }
    }

    public function run()
    {
        return $this->menu;
    }
}
?>