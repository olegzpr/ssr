<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace common\models;

use yii\db\ActiveQuery;
use yii\db\ActiveRecord;
use yii\db\Query;


class Analitics extends  ActiveRecord{

    public function attributeLabels()
    {
        return [

            'id'=>'ID',
            'data'=>'Дата',
            'ip'=>'IP адрес',
            'session'=>'Сессия',
            'country'=>'Страна',
            'city'=>'Город',
            'page'=>'Страница',
        ];
    }

    public function rules()
    {
        return [
            [['data', 'ip', 'session', 'country', 'city', 'page'], 'safe']
        ];
    }

    public function get7day(){
        $info=[];
        $label=[];
        for ($i=6;$i>=0;$i--){
            $date=new \DateTime("-".$i."day");
            array_push($label, $date->format("d.m.Y"));
            $res=Analitics::find()->where(['data'=>$date->format("Y-m-d")])->count();
            array_push($info, $res);
        }

        return [
            'data'=>$info,
            'label'=>$label
        ];
    }

    public function top5(){
        $info=[];
        $label=[];
        $date=new \DateTime();
//        $query = new ActiveQuery();
//        $model=$query->select(['page' => 'page', 'c' => 'count(*)'])
//            ->from('analitics')
//            ->groupBy('page')
//            ->orderBy(['c' => 'desc'])
//            ->limit(5)
//            ->all();
        $model = \Yii::$app->db->createCommand('SELECT page, count(*) as c 
                              FROM analitics where data>=\''.$date->modify("-6day")->format("Y-m-d").'\'
                              GROUP BY page 
                              ORDER BY c DESC
                              LIMIT 5')
            ->queryAll();
        foreach ($model as $row){
            $x=explode('.', $row['page']);
            if (empty($x[1])) {
                array_push($info, $row['c']);
                array_push($label, $row['page']);
            }
        }

        return [
            'data'=>$info,
            'label'=>$label
        ];
    }
}