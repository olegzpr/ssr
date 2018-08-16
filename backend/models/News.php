<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class News extends  ActiveRecord{

    static $status=[
        0 => 'не активная',
        1 => 'активная'
    ];

    public function nameTable(){
        return 'Новости';
    }

    public function actionRow(){
        return [
            'delete'=>'Удалить',
            'active'=>'Активировать',
            'deactive'=>'Деактивировать'
        ];
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'title'=>'Название',
            'intro'=>'Краткое описание',
            'text'=>'Текст',
            'data'=>'Дата',
            'pref'=>'Url',
            'image'=>'Фото',
            'status'=>'Активная?'

        ];
    }

    public function rules()
    {
        return [
            ['title','required','message'=>'Поле \'название\' не может быть пустым'],
            ['text','required','message'=>'Поле \'текст\' не может быть пустым'],
            ['intro','required','message'=>'Поле \'краткое описание\' не может быть пустым'],
            ['data','required','message'=>'Поле \'дата\' не может быть пустым'],
            [['pref', 'image', 'status'], 'safe']

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
                'name'=>'title',
                'type'=>'input',
                'display'=>true,
                'attr'=>[
                    'data-pref'=>'out'
                ]
            ],
            [
                'name'=>'intro',
                'type'=>'editor',
                'display'=>false
            ],
            [
                'name'=>'text',
                'type'=>'editor',
                'display'=>false
            ],
            [
                'name'=>'data',
                'type'=>'datetimepicker',
                'display'=>true
            ],
            [
                'name'=>'status',
                'type'=>'select',
                'display'=>true,
                'data'=>self::$status
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
                'name'=>'image',
                'type'=>'file',
                'display'=>false
            ],
        ];
    }

}