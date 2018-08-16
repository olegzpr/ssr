<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class GeoCity extends  ActiveRecord{

    public function nameTable(){
        return 'Города';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'region'=>'Область',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'region'],'required'],
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
                'name'=>'region',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'geo_region',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ]
        ];
    }

}