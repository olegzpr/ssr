<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 07.03.17
 * Time: 10:05
 */

namespace backend\models;

use yii\db\ActiveRecord;

class  Filters extends ActiveRecord {

    public $date_range;
    public $category;
    public $word;

    public function rules()
    {
        return [

            [['date_range','category','word'],'safe']
        ];

    }


}