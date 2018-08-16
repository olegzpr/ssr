<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class InputValue extends  ActiveRecord{

    public function nameTable(){
        return 'Значения полей';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'input_id'=>'ID блока',
            'value'=>'Значение',

        ];
    }

    public function rules()
    {
        return [
            [['input_id', 'value'],'safe'],
        ];
    }

    public function rows(){
        return [
            [
                'name'=>'id',
                'type'=>'input',
                'display'=>true,
                'attr'=>[
                    'disabled'=>'disabled'
                ]
            ],
            [
                'name'=>'name',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'code',
                'type'=>'code',
                'display'=>true,
            ]
        ];
    }

}