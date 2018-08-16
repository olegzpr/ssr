<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Sliders extends  ActiveRecord{

    public function nameTable(){
        return 'Слайдеры';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'image'=>'Фото',
            'name'=>'Название',
            'alts'=>'Подписи',
        ];
    }

    public function rules()
    {
        return [
            [['name'], 'required'],
            [['image', 'alts'], 'safe']
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
                'name'=>'image',
                'type'=>'file',
                'display'=>false
            ],
            [
                'name'=>'alts',
                'type'=>'textarea',
                'display'=>false,
            ]
        ];
    }

}