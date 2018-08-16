<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class PageBlocks extends  ActiveRecord{

    public function nameTable(){
        return 'Блоки страниц';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'page_id'=>'ID страницы',
            'name'=>'Название',
            'code'=>'Код'

        ];
    }

    public function rules()
    {
        return [
            [['name', 'code'],'required'],
            ['page_id', 'integer']
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
                'name'=>'code',
                'type'=>'code',
                'display'=>true,
            ]
        ];
    }

}