<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Rows extends  ActiveRecord{

    public function nameTable(){
        return 'Поля';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'step_id'=>'Шаг',
            'type'=>'Тип поля',
            'name'=>'Название',
            'status'=>'Публикация',
            'required'=>'Обязательное',
            'hock'=>'Функция',
            'attr'=>'Атрибуты',
            'sub'=>'Привязка к полю',
            'filter'=>'Показывать в фильтре',
            'srt'=>'Порядок вывода при добавлении',
            'srt_filter'=>'Порядок вывода в каталоге',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'step_id', 'type'],'required'],
            [['status', 'required', 'hock', 'sub', 'attr', 'filter', 'srt', 'srt_filter'], 'safe']
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
                'name'=>'step_id',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'steps',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
            [
                'name'=>'type',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'type_row',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
            [
                'name'=>'name',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'status',
                'type'=>'checkbox',
                'display'=>false,
            ],
            [
                'name'=>'required',
                'type'=>'checkbox',
                'display'=>false,
            ],
            [
                'name'=>'hock',
                'type'=>'textarea',
                'display'=>false,
            ],
            [
                'name'=>'attr',
                'type'=>'textarea',
                'display'=>false,
            ],
            [
                'name'=>'sub',
                'type'=>'select',
                'display'=>false,
                'table'=>[
                    'name'=>'rows',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ],
            [
                'name'=>'filter',
                'type'=>'checkbox',
                'display'=>true,
            ],
            [
                'name'=>'srt',
                'type'=>'input',
                'display'=>false,
            ],
            [
                'name'=>'srt_filter',
                'type'=>'input',
                'display'=>false,
            ],
        ];
    }

}