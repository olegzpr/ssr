<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class SystemNotifications extends  ActiveRecord{

    public function nameTable(){
        return 'Оповещения системы';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user'=>'Пользователь',
            'title'=>'Заголовок',
            'text'=>'Текст',
            'data'=>'Дата и время',
        ];
    }

    public function rules()
    {
        return [
            [['title', 'text'],'required'],
            [['user', 'data'], 'safe']
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
                'name'=>'user',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'user',
                    'value'=>'username',
                    'text'=>'username'
                ]
            ],
            [
                'name'=>'title',
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
                'type'=>'none',
                'display'=>true
            ]
        ];
    }

}