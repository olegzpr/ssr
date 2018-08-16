<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace frontend\models;

use backend\models\ItemProp;
use yii\db\ActiveRecord;


class Category extends  ActiveRecord{

    public function getCategoryPref($id){
        $res=\backend\models\Category::findOne($id);
        return $res['pref'];
    }

}