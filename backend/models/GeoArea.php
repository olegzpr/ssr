<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class GeoArea extends  ActiveRecord{

    public function nameTable(){
        return 'Районы';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'name'=>'Название',
            'region'=>'Область',
            'city'=>'Город',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'region', 'city'],'required'],
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
            ],
            [
                'name'=>'city',
                'type'=>'select',
                'display'=>true,
                'table'=>[
                    'name'=>'geo_city',
                    'value'=>'id',
                    'text'=>'name'
                ]
            ]
        ];
    }

}