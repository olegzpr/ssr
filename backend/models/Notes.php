<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Notes extends  ActiveRecord{

    public function nameTable(){
        return 'Заметки';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user_id'=>'ID пользователя',
            'item_id'=>'ID объявления',
            'text'=>'Текст',
            'data'=>'Дата',
        ];
    }

    public function rules()
    {
        return [
            [['user_id', 'item_id', 'text'],'required'],
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
                'name'=>'user_id',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'user',
                    'value'=>'id',
                    'text'=>'username'
                ]
            ],
            [
                'name'=>'item_id',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'text',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'data',
                'type'=>'datetimepicker',
                'display'=>false,
            ]
        ];
    }

}