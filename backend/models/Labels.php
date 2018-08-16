<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Labels extends  ActiveRecord{

    public function nameTable(){
        return 'Метки';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'icon'=>'Иконка',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'icon'],'required'],
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
                'name'=>'icon',
                'type'=>'input',
                'display'=>false,
            ]
        ];
    }

}