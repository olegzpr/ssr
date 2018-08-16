<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Settings extends  ActiveRecord{


    public static function tableName()
    {
        return '{{settings}}';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Поле',
            'title'=>'Назва',
            'value'=>'Значення',
            'type'=>'Тип'

        ];
    }

    public function rules()
    {
        return [
            [['name', 'title', 'value', 'type'],'safe'],
        ];
    }

}