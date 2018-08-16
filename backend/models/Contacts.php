<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Contacts extends  ActiveRecord{

    public function nameTable(){
        return 'Контакты';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user'=>'Пользователь',
            'type'=>'Тип контакта',
            'value'=>'Значение',
        ];
    }

    public function rules()
    {
        return [
            [['user', 'type', 'value'],'required'],
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
        ];
    }

    static $program=[
        1=>'Telegram',
        2=>'Viber',
        3=>'Whatsapp'
    ];

}