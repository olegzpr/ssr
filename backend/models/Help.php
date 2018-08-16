<?php
namespace backend\models;

use Yii;
use yii\base\Model;
use yii\db\Query;

/**
 * Login form
 */
class Help extends Model
{
    static $lang='ru';

    public function getSelect($data, $now){
        $res=(new Query())
            ->select("*")
            ->from($data['name'])
            ->where([$data['value']=>$now])
            ->one();

        return $res[$data['text']];
    }

    public function getOption($data){
        $res=(new Query())
            ->select("*")
            ->from($data['name'])
            ->all();
        $arr=[];
        foreach ($res as $row){
            $arr[$row[$data['value']]]=$row[$data['text']];
        }

        return $arr;
    }

    public function getOptionMenu(){
        $arr=[
            [
                'name'=>'Новини',
                'pref'=>'/news'
            ],
            [
                'name'=>'Категорії',
                'pref'=>'/category'
            ],
            [
                'name'=>'Коментарі',
                'pref'=>'/comment'
            ],
            [
                'name'=>'Звортній зв`язок',
                'pref'=>'/feedback'
            ],
            [
                'name'=>'Файли',
                'pref'=>'/files'
            ],
            [
                'name'=>'Налаштування',
                'pref'=>'/settings'
            ],
            [   'name'=>'Архів',
                'pref'=>'/archive'
            ],
        ];
        $pages=[];
        foreach ($arr as $row){
            $pages[$row['pref']]=$row['name'];
        }

        return $pages;
    }

    public function Lang(){
        $json=file_get_contents($_SERVER['DOCUMENT_ROOT'].'/backend/lang/'.self::$lang.'.json');
        $json=json_decode($json);
        return $json;
    }
}
