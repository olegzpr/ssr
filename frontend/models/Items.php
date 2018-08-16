<?php
/**
 * Created by PhpStorm.
 * User: gebruiker
 * Date: 20.01.17
 * Time: 13:59
 */

namespace frontend\models;

use backend\models\GeoCity;
use backend\models\ItemProp;
use backend\models\LabelItems;
use backend\models\Labels;
use backend\models\Rows;
use backend\models\Settings;
use common\models\Helper;
use yii\db\ActiveRecord;


class Items extends ActiveRecord
{

    public function getProp($item, $prop)
    {
        $prop = ItemProp::find()->where(['item_id' => $item, 'row_id' => $prop])->one();
        return $prop['value'];
    }

    public function getPicture($id, $all = true)
    {
        $propId = Rows::findOne(['label' => '_photo_']);
        $img = ItemProp::find()->where(['item_id' => $id, 'row_id' => $propId['id']])->one();
        $pic = json_decode($img['value']);
        if (count($pic) > 0) {
            if ($all) {
                return $pic;
            } else {
                return '/source/items/' . $pic[0];
            }
        } else {
            return '/images/no_image.jpg';
        }
    }

    /**
     * Получение свойства объявления
     * @param $item - id объявления
     * @param $prop - label свойства
     * @return mixed
     */
    static function getPropLabel($item, $prop)
    {
        $id = Rows::find()->where(['label' => $prop])->one();
        $prop = ItemProp::find()->where(['item_id' => $item, 'row_id' => $id['id']])->one();
        return $prop['value'];
    }

    /**
     * Получение статуса объявления
     * @param $id - id объявления
     * @return mixed
     * @throws \yii\db\Exception
     */
    public function getStatus($id)
    {
        $res = \Yii::$app->db->createCommand("select name from item_status where id='$id'")->queryOne();
        return $res['name'];
    }

    public function getFavorite($id)
    {
        if (!\Yii::$app->user->isGuest) {
            $favorite = Favorites::find()->where(['user_id' => \Yii::$app->user->identity->id, 'item_id' => $id])->one();
            return empty($favorite) ? false : true;
        } else {
            return false;
        }
    }

    public static function sortPrice($a, $b)
    {
        if ($a['price'] == $b['price']) {
            return 0;
        }
        return ($a['price'] < $b['price']) ? -1 : 1;
    }

    public function getIdRow($label)
    {
        $row = Rows::findOne(['label' => $label]);
        return $row['id'];
    }

    public function viewItem($item)
    {
        $name = Helper::titleFormat($item['id']);
        ?>
        <div class="col-sm-4 col-md-3">
            <a href="/catalog/<?=\common\models\Helper::str2url($name).'-'.$item['id']?>" class="catalog-item-box">
                <img src="<?=Helper::getPicture(\frontend\models\Items::getPropLabel($item['id'], '_photo_'))[0]?>" alt="<?php echo $name ?>">
                <div class="info">
                    <div class="col">
                        <div class="info-number"><?=Items::getPropLabel($item['id'], '_place_')?> кв.м.</div>
                    </div>
                    <div class="col">
                        <div class="info-number">Комнаты: <?=Items::getPropLabel($item['id'], '_room_')?></div>
                    </div>
                </div>
                <div class="price"><?=Items::getPropLabel($item['id'], '_price_')?> грн</div>
                <div class="bottom clearfix">
                    <span class="address"><i class="fa fa-map-marker"></i>
                        <?php
                        echo GeoCity::findOne($item['city'])['name'];
                        ?>
                    </span>
                </div>
            </a>
        </div>
        <?php
    }

    static function getPrice($id){
        $course = Settings::findOne(1)['value'];
        $currencyItem = Items::getPropLabel($id, '_currency_');
        $currencyUser = isset($_SESSION['currencySite'])?$_SESSION['currencySite']:1;
        if ($currencyItem==$currencyUser){
            $price = Items::getPropLabel($id, '_price_');
        } else {
            if ($currencyItem==1&&$currencyUser==2){
                $price = Items::getPropLabel($id, '_price_')/$course;
            } else {
                $price = Items::getPropLabel($id, '_price_')*$course;
            }
        }

        return $price;
    }
}