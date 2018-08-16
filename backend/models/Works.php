<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Works extends  ActiveRecord{

    public function nameTable(){
        return 'Работы';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'client_id'=>'Клиент',
            'service_id'=>'Услуга',
            'target'=>'Цель',
            'idea'=>'Идея',
            'solution'=>'Решение',
            'result'=>'Результат',
            'image_title'=>'Картинка в заголовок',
            'image_thumb'=>'Картинка в превью',
            'employees'=>'Сотрудники',
            'pref'=>'URL',
            'srt'=>'Порядок вывода'

        ];
    }

    public function rules()
    {
        return [
            [['name', 'client_id', 'service_id', 'target', 'idea', 'solution', 'pref'],'required'],
            [['result', 'image_title', 'image_thumb', 'employees', 'srt'], 'safe']
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
                'name'=>'service_id',
                'type'=>'select',
                'display'=>false,
                'table'=>[
                    'name'=>'services',
                    'value'=>'id',
                    'text'=>'name'
                ],
                'attr'=>[
                    'multiple'=>true
                ]
            ],
            [
                'name'=>'target',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'idea',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'solution',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'image_title',
                'type'=>'file',
                'display'=>false,
            ],
            [
                'name'=>'image_thumb',
                'type'=>'file',
                'display'=>false,
            ],
            [
                'name'=>'employees',
                'type'=>'select',
                'display'=>false,
                'table'=>[
                    'name'=>'employees',
                    'value'=>'id',
                    'text'=>'fio'
                ],
                'attr'=>[
                    'multiple'=>true
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
                'name'=>'srt',
                'type'=>'input',
                'display'=>false,
            ]
        ];
    }

}