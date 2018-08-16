<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace backend\models;

use yii\db\ActiveRecord;


class Seo extends  ActiveRecord{

    public function nameTable(){
        return 'SEO';
    }

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'part'=>'Раздел',
            'element'=>'Элементы',
            'title'=>'Title',
            'keywords'=>'Keywords',
            'description'=>'Description',
        ];
    }

    public function rules()
    {
        return [
            [['part', 'element', 'title', 'keywords', 'description'], 'safe']
        ];
    }
}