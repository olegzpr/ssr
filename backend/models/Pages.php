<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Pages extends  ActiveRecord{

    static $status=[
        0 => 'не активна',
        1 => 'активна'
    ];

    public function nameTable(){
        return 'Страницы сайта';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'pref'=>'Ссылка',
            'text'=>'Текст',
            'image'=>'Фото',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'pref', 'text'],'required'],
            ['image', 'safe']
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
                'display'=>true,
                'attr'=>[
                    'data-pref'=>'out'
                ]
            ],
            [
                'name'=>'pref',
                'type'=>'input',
                'display'=>false,
                'attr'=>[
                    'data-pref'=>'in'
                ]
            ],
            [
                'name'=>'text',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'image',
                'type'=>'file',
                'display'=>false,
            ]
        ];
    }

}