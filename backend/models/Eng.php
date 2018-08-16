<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Eng extends  ActiveRecord{

    public function nameTable(){
        return 'Английская версия';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'table'=>'Таблица',
            'item_id'=>'ID позиции',
            'input'=>'Поле',
            'value'=>'Значение',
        ];
    }

    public function rules()
    {
        return [
            [['item_id', 'table', 'input', 'value'],'required'],
        ];
    }

    public function rows(){

    }

}