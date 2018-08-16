<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Items extends  ActiveRecord{

    public function nameTable(){
        return 'Объявления';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'date_create'=>'Дата добавления',
            'user'=>'Пользователь',
            'status'=>'Состояние'
        ];
    }

    public function rules()
    {
        return [
            [['date_create', 'status'],'required'],
            ['user', 'safe']
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
                'name'=>'date_create',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'user',
                'type'=>'select',
                'display'=>false,
                'table'=>[
                    'name'=>'user',
                    'value'=>'id',
                    'text'=>'username'
                ]
            ],
            [
                'name'=>'status',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'item_status',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
        ];
    }
}