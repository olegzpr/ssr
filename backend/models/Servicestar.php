<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Servicestar extends  ActiveRecord{

    public function nameTable(){
        return 'Услуги на главную';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'intro'=>'Краткое описание',
            'image'=>'Иконка',
            'url'=>'Ссылка',
            'srt'=>'Порядок вывода',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'intro', 'url'],'required'],
            [['image', 'srt'], 'safe']
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
                'name'=>'intro',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'image',
                'type'=>'file',
                'display'=>false,
            ],
            [
                'name'=>'url',
                'type'=>'input',
                'display'=>false
            ],
            [
                'name'=>'srt',
                'type'=>'input',
                'display'=>false
            ]
        ];
    }

}