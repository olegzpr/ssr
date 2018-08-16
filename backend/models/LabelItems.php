<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class LabelItems extends  ActiveRecord{

    public function nameTable(){
        return 'Метки объявлений';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user_id'=>'ID пользователя',
            'item_id'=>'ID объявления',
            'label_id'=>'ID метки',
            'data'=>'Дата',
        ];
    }

    public function rules()
    {
        return [
            [['user_id', 'item_id', 'label_id'],'required'],
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
                'type'=>'input',
                'display'=>false
            ],
            [
                'name'=>'item_id',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'label_id',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'data',
                'type'=>'datetimepicker',
                'display'=>true,
            ]
        ];
    }

}