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


class Sms extends  ActiveRecord{

    public function code(){
        $str='1234567890qwertyuiopasdfghjklzxcvbnm';
        $code='';
        for ($i=0;$i<6;$i++){
            $code.=$str[rand(0, strlen($str)-1)];
        }

        return $code;
    }

}