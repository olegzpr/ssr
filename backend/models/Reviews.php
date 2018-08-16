<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Reviews extends  ActiveRecord{

    public function nameTable(){
        return 'Отзывы';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'client_id'=>'Клиент',
            'fio'=>'ФИО клиента',
            'position'=>'Должность',
            'image'=>'Фото',
            'text'=>'Отзыв',
            'video'=>'Видео',
            'srt'=>'Порядок вывода'
        ];
    }

    public function rules()
    {
        return [
            [['client_id', 'fio', 'text'],'required'],
            [['position', 'image', 'video', 'srt'], 'safe']
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
                'name'=>'client_id',
                'type'=>'select',
                'display'=>false,
                'table'=>[
                    'name'=>'clients',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
            [
                'name'=>'fio',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'position',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'image',
                'type'=>'file',
                'display'=>false,
            ],
            [
                'name'=>'text',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'video',
                'type'=>'textarea',
                'display'=>false,
            ],
            [
                'name'=>'srt',
                'type'=>'input',
                'display'=>false,
            ]
        ];
    }

}