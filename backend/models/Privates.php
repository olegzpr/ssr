<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Privates extends  ActiveRecord{

    public function nameTable(){
        return 'Настроки приватности';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user'=>'Пользователь',
            'private_id'=>'Тип',
            'value'=>'Значение',
        ];
    }

    public function rules()
    {
        return [
            [['user', 'private_id'],'required'],
            [['value'], 'safe']
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
                'name'=>'pref',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'active',
                'type'=>'checkbox',
                'display'=>false
            ]
        ];
    }

}