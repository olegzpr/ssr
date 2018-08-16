<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Premia extends  ActiveRecord{

    public function nameTable(){
        return 'Премии';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'image'=>'Картинка',
        ];
    }

    public function rules()
    {
        return [
            [['name'],'required'],
            [['image'], 'safe']
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
                'display'=>false,
            ]
        ];
    }

}