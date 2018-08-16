<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Locality extends  ActiveRecord{

    public function nameTable(){
        return 'Города и области';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'title'=>'Название',
            'abbreviations'=>'Аббревиатура',
            'parent_id'=>'Родитель',
            'number'=>'Номер',
            'type'=>'Тип',
        ];
    }

    public function rules()
    {
        return [
            [['title', 'type'],'required'],
            [['abbreviations', 'parent_id', 'number'], 'safe']
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
                'name'=>'title',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'abbreviations',
                'type'=>'input',
                'display'=>false
            ],
            [
                'name'=>'parent_id',
                'type'=>'select',
                'display'=>true,
                'table' => [
                    'name' => 'locality',
                    'value' => 'id',
                    'text' => 'title'
                ]
            ],
            [
                'name'=>'number',
                'type'=>'input',
                'display'=>false
            ],
            [
                'name'=>'type',
                'type'=>'input',
                'display'=>false
            ],
        ];
    }

}