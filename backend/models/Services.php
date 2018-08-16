<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Services extends  ActiveRecord{

    public function nameTable(){
        return 'Услуги';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'intro'=>'Краткое описание',
            'desc'=>'Описание',
            'price'=>'Цена от',
            'icon'=>'Иконка',
            'sub'=>'Подуслуги',
            'cover'=>'Обложка',
            'srt'=>'Порядок вывода',
            'pref'=>'Ссылка',
            'video_youtube'=>'Видео с ютуба',

        ];
    }

    public function rules()
    {
        return [
            [['name', 'desc', 'price', 'intro'],'required'],
            [['icon', 'sub', 'cover', 'srt', 'video_youtube'], 'safe']
        ];
    }

    public function rows(){
        return [
            [
                'name'=>'id',
                'type'=>'input',
                'display'=>true,
                'trans'=>false,
                'attr'=>[
                    'disabled'=>'disabled'
                ]
            ],
            [
                'name'=>'name',
                'type'=>'input',
                'display'=>true,
                'trans'=>true,
                'attr'=>[
                    'data-pref'=>'out'
                ]
            ],
            [
                'name'=>'intro',
                'type'=>'editor',
                'display'=>true,
                'trans'=>true
            ],
            [
                'name'=>'desc',
                'type'=>'editor',
                'display'=>false,
                'trans'=>true
            ],
            [
                'name'=>'price',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'icon',
                'type'=>'file',
                'display'=>false,
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
                'name'=>'sub',
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
                'name'=>'cover',
                'type'=>'file',
                'display'=>false,
            ],
            [
                'name'=>'srt',
                'type'=>'input',
                'display'=>false,
            ],
            [
                'name'=>'video_youtube',
                'type'=>'input',
                'display'=>false,
            ]
        ];
    }

}