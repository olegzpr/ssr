<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Rating extends  ActiveRecord{

    public function nameTable(){
        return 'rating';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название'
        ];
    }

    public function rules()
    {
        return [
            [['name'],'required'],
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
            ]
        ];
    }

}