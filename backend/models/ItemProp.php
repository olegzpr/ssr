<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class ItemProp extends  ActiveRecord{

    public function nameTable(){
        return 'Свойства объявлений';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'item_id'=>'ID объявления',
            'row_id'=>'ID поля',
            'value'=>'Значение',

        ];
    }

    public function rules()
    {
        return [
            [['item_id', 'row_id'],'required'],
            [['value'], 'safe']
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
                'name'=>'item_id',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'row_id',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'rows',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
            [
                'name'=>'value',
                'type'=>'input',
                'display'=>true
            ],
        ];
    }

}