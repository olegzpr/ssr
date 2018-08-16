<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Vacancies extends  ActiveRecord{

    public function nameTable(){
        return 'Вакансии';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'intro'=>'Краткое описание',
            'text'=>'Описание',
            'url'=>'Ссылка',
            'button_name'=>'Текст на кнопке',
            'srt'=>'Порядок вывода'
        ];
    }

    public function rules()
    {
        return [
            [['name', 'intro', 'text'],'required'],
            [['url', 'button_name', 'srt'], 'safe']
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
                'name'=>'text',
                'type'=>'editor',
                'display'=>false
            ],
            [
                'name'=>'url',
                'type'=>'input',
                'display'=>false
            ],
            [
                'name'=>'button_name',
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