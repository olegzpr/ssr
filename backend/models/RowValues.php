<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class RowValues extends  ActiveRecord{

    public function nameTable(){
        return 'Значения полей';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'input_id'=>'Поле',
            'label'=>'Название',
            'value'=>'Значение',
            'sub'=>'Привязка'
        ];
    }

    public function rules()
    {
        return [
            [['input_id', 'label', 'value'],'required'],
            [['sub'], 'safe']
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
                'name'=>'input_id',
                'type'=>'select',
                'display'=>false,
                'table'=>[
                    'name'=>'rows',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
            [
                'name'=>'label',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'value',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'sub',
                'type'=>'select',
                'display'=>false,
                'table' => [
                    'name' => 'row_values',
                    'value' => 'id',
                    'text' => 'label'
                ]
            ]
        ];
    }

}