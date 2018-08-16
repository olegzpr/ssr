<?php
namespace backend\widget;

use yii\base\Widget;
use yii\db\Query;
use yii\helpers\Html;

class Nav extends Widget
{
    private $html;
    public $table;
    public $active;

    public function init()
    {
        parent::init();

        $this->html='<div class="btn-group"><button type="button" class="btn btn-white"><i class="fa fa-chevron-left"></i></button>';

        $res=(new Query())
            ->select("*")
            ->from($this->table)
            ->count();

        $page=ceil($res/20);
        $min = $this->active<5?1:$this->active-4;
        $max = $this->active<5?10:$this->active+5;
        for ($i=$min;$i<=$page&&$i<=$max;$i++){
            $class=$this->active==$i?'active':'';
            $this->html.='<a href="?page='.$i.'" class="btn btn-white '.$class.'">'.$i.'</a>';
        }

        $this->html.='<button type="button" class="btn btn-white"><i class="fa fa-chevron-right"></i></button></div>';
    }

    public function run()
    {
        return $this->html;
    }
}
?>