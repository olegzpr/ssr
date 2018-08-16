<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class ItemStatics extends  ActiveRecord{

    public function nameTable(){
        return 'Статистика объявлений';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'item_id'=>'ID элемента',
            'type'=>'Тип',
            'session'=>'Сессия',
            'data'=>'Дата',
        ];
    }

    public function rules()
    {
        return [
            [['item_id', 'type', 'session'],'required'],
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