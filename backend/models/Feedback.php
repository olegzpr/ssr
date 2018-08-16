<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Feedback extends  ActiveRecord{

    static $status=[
        0 => 'обробленний',
        1 => 'не обробленний'
    ];

    public function nameTable(){
        return 'Зворотній зв`язок';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'data'=>'Дата та час',
            'name'=>'Ім`я',
            'email'=>'Email',
            'theme'=>'Тема',
            'text'=>'Текст',
            'status'=>'Статус'

        ];
    }

    public function rules()
    {
        return [
            [['name', 'email', 'theme', 'text'],'required'],
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
                'name'=>'email',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'theme',
                'type'=>'input',
                'display'=>true,
            ],
            [
                'name'=>'text',
                'type'=>'editor',
                'display'=>false,
            ],
            [
                'name'=>'data',
                'type'=>'datetimepicker',
                'display'=>true,
                'attr'=>[
                    'disabled'=>'disabled'
                ]
            ],
            [
                'name'=>'status',
                'type'=>'select',
                'display'=>true,
                'data'=>self::$status
            ],
        ];
    }

}