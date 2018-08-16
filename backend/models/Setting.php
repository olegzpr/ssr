<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Setting extends  ActiveRecord{

    public function nameTable(){
        return 'Настроки';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'pref'],'required'],
            [['active'], 'safe']
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
                'name'=>'pref',
                'type'=>'input',
                'display'=>true
            ],
            [
                'name'=>'active',
                'type'=>'checkbox',
                'display'=>false
            ]
        ];
    }

    public function show($pref){
        $model=Setting::find()->where(['pref'=>$pref])->one();
        if ($model['active']==1){
            return true;
        } else {
            return false;
        }
    }
}