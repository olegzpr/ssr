<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace common\models;

use yii\db\ActiveQuery;
use yii\db\ActiveRecord;
use yii\db\Query;


class Orders extends  ActiveRecord{

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'phone'=>'Телефон',
            'email'=>'Email',
            'data'=>'Дата',
            'ip'=>'IP адрес',
            'status'=>'Статус',
        ];
    }

    public function rules()
    {
        return [
            [['data', 'ip', 'status', 'email'], 'safe']
        ];
    }
}