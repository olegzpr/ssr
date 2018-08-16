<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Steps extends  ActiveRecord{

    public function nameTable(){
        return 'Шаги';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'mask'=>'Маска',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'mask'],'required'],
            [['sub'], 'safe']
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
                'name'=>'mask',
                'type'=>'input',
                'display'=>false,
            ]
        ];
    }

}