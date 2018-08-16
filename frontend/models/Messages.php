<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace frontend\models;

use yii\db\ActiveRecord;

class Messages extends  ActiveRecord{

    public function lastSms($user){
        $res=\Yii::$app->db->createCommand("select * from messages where (to_user='".\Yii::$app->user->identity->username."' and from_user='".$user."') or (from_user='".\Yii::$app->user->identity->username."' and to_user='".$user."') order by id desc limit 1")->queryOne();

        return $res;
    }

    public function saveMessage($user_from, $user_to, $text, $data){
        $sms=new Messages();
        $sms->from_user=$user_from;
        $sms->to_user=$user_to;
        $sms->text=$text;
        $sms->data=date("Y-m-d H:i:s", strtotime($data));
        $sms->save();
    }

}