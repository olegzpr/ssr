<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Roles extends  ActiveRecord{

    static $status=[
        0 => 'не активна',
        1 => 'активна'
    ];

    public function nameTable(){
        return 'Ролі';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Назва',
            'allow'=>'Доступні розділи',

        ];
    }

    public function rules()
    {
        return [
            [['name'],'required'],
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
                'name'=>'allow',
                'type'=>'select',
                'display'=>true,
                'data'=>self::$status,
                'attr'=>[
                    'multiple'=>true
                ]
            ]
        ];
    }

}