<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Alerts extends  ActiveRecord{

    public function nameTable(){
        return 'Настроки оповещений';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user'=>'Пользователь',
            'alert_type'=>'Тип оповещения',
            'contact_id'=>'ID контакта',
            'chanel'=>'Канал',
        ];
    }

    public function rules()
    {
        return [
            [['user', 'alert_type', 'contact_id'],'required'],
            [['chanel'], 'safe']
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