<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class SaveFilters extends  ActiveRecord{

    public function nameTable(){
        return 'Сохраненные фильтры';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'user_id'=>'ID пользователя',
            'text'=>'Текст',
            'name'=>'Название',
        ];
    }

    public function rules()
    {
        return [
            [['user_id', 'text', 'name'],'required'],
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
                'display'=>true
            ],
            [
                'name'=>'text',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'name',
                'type'=>'input',
                'display'=>true
            ]
        ];
    }

}