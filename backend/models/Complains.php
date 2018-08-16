<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Complains extends  ActiveRecord{

    public function nameTable(){
        return 'Жалобы';
    }

    public function attributeLabels()
    {
        return [
            'id'=>'ID',
            'uid'=>'ID пользователя',
            'item'=>'Объявление',
            'text'=>'Текст',
            'data'=>'Дата',
        ];
    }

    public function rules()
    {
        return [
            [['uid', 'item', 'text'],'required'],
            [['data'], 'safe']
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
                'name'=>'uid',
                'type'=>'select',
                'display'=>true,
                'table' => [
                    'name' => 'user',
                    'value' => 'id',
                    'text' => 'username'
                ]
            ],
            [
                'name'=>'item',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'text',
                'type'=>'editor',
                'display'=>false
            ],
            [
                'name'=>'data',
                'type'=>'input',
                'display'=>true
            ]
        ];
    }

}