<?php
namespace frontend\components;

use backend\models\Steps;
use yii\base\Widget;
use yii\helpers\Html;

class StepWidget extends Widget
{
    private $steps;
    public $mask;
    public $step;
    public $id;

    public function init()
    {
        parent::init();
        $this->steps = Steps::find()->where(['mask'=>$this->mask])->all();
    }

    public function run()
    {
        return $this->render('step', [
            'steps' => $this->steps,
            'step' => $this->step,
            'id' => $this->id
        ]);
    }
}