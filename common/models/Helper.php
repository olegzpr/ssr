<?php
namespace common\models;

use backend\models\GeoArea;
use backend\models\GeoCity;
use backend\models\GeoRegion;
use backend\models\ItemProp;
use backend\models\Items;
use backend\models\RowValues;
use Yii;
use yii\base\Model;

class Helper extends Model{
    public function rus2translit($string) {
        $converter = array(
            'а' => 'a',   'б' => 'b',   'в' => 'v',
            'г' => 'g',   'д' => 'd',   'е' => 'e',
            'ё' => 'e',   'ж' => 'zh',  'з' => 'z',
            'и' => 'i',   'й' => 'y',   'к' => 'k',
            'л' => 'l',   'м' => 'm',   'н' => 'n',
            'о' => 'o',   'п' => 'p',   'р' => 'r',
            'с' => 's',   'т' => 't',   'у' => 'u',
            'ф' => 'f',   'х' => 'h',   'ц' => 'c',
            'ч' => 'ch',  'ш' => 'sh',  'щ' => 'sch',
            'ь' => '\'',  'ы' => 'y',   'ъ' => '\'',
            'э' => 'e',   'ю' => 'yu',  'я' => 'ya',

            'А' => 'A',   'Б' => 'B',   'В' => 'V',
            'Г' => 'G',   'Д' => 'D',   'Е' => 'E',
            'Ё' => 'E',   'Ж' => 'Zh',  'З' => 'Z',
            'И' => 'I',   'Й' => 'Y',   'К' => 'K',
            'Л' => 'L',   'М' => 'M',   'Н' => 'N',
            'О' => 'O',   'П' => 'P',   'Р' => 'R',
            'С' => 'S',   'Т' => 'T',   'У' => 'U',
            'Ф' => 'F',   'Х' => 'H',   'Ц' => 'C',
            'Ч' => 'Ch',  'Ш' => 'Sh',  'Щ' => 'Sch',
            'Ь' => '\'',  'Ы' => 'Y',   'Ъ' => '\'',
            'Э' => 'E',   'Ю' => 'Yu',  'Я' => 'Ya',
        );
        return strtr($string, $converter);
    }
    public function str2url($str) {
        // переводим в транслит
        $str = self::rus2translit($str);
        // в нижний регистр
        $str = strtolower($str);
        // заменям все ненужное нам на "-"
        $str = preg_replace('~[^-a-z0-9_]+~u', '-', $str);
        // удаляем начальные и конечные '-'
        $str = trim($str, "-");
        return $str;
    }

    public function getUserDate($data){
        $month=[
            'rus'=>[
                1 => 'Января',
                2 => 'Февраля',
                3 => 'Марта',
                4 => 'Апреля',
                5 => 'Мая',
                6 => 'Июля',
                7 => 'Июня',
                8 => 'Августа',
                9 => 'Сентября',
                10 => 'Ноября',
                11 => 'Ноября',
                12 => 'Декабря',
            ]
        ];

        $data=new \DateTime($data);
        $now_month=$data->format("n");
        return date($data->format("d")." ".$month['rus'][$now_month]." ".$data->format("H").":".$data->format("i"));
    }

    public function getOnePicture($img, $default=false){
        $pic=json_decode($img);
        if (count($pic)>0) {
            return $pic[0];
        } else {
            if ($default==false){
                return false;
            } else {
                return '/images/no-photo.jpg';
            }
        }
    }

    public function getPicture($img){
        $img=json_decode($img);
        return count($img)>0?$img:['/images/slice-1.png'];
    }

    static function getShortText($text, $lenght){
        $text=strip_tags($text);
        if(mb_strlen($text, 'UTF-8')>$lenght)
        {
            $text = mb_substr($text, 0, $lenght, 'UTF-8');
            return $text.'...';
        }
        else
            return $text;
    }

    static function titleFormat($id){
        $title = '';
        $type=\frontend\models\Items::getPropLabel($id, '_type_');
        switch ($type){
            case '1':
                $title='Продам ';
                break;

            case '2':
                $title='Куплю ';
                break;

            case '3':
                $title='Сдам ';
                break;

            case '4':
                $title='Сниму ';
                break;
        }
        $name_obj=\frontend\models\Items::getPropLabel($id, '_name_obj_');
        switch ($name_obj){
            case '1':
                $room=\frontend\models\Items::getPropLabel($id, '_room_');
                $title.=$room.'-комнатную ';
                $title.='квартиру, ';
                break;

            case '2':
                $title.='дом, ';
                break;

            case '3':
                $title.='дачу, ';
                break;

            case '4':
                $title.='комнату, ';
                break;
        }
        $info = Items::findOne($id);
        $address = '';

        if ($info['city']!='') {
            $address .= GeoCity::findOne($info['city'])['name'].', ';
        }
        if ($info['area']!='') {
            $address .= GeoArea::findOne($info['area'])['name'].', ';
        }
        if ($address!=''){
            $address = substr($address, 0, -2);
        }
        $title.=$address;
        return $title;
    }

    public function titleFormatItem($id){
        $title = '';
        $type=\frontend\models\Items::getPropLabel($id, '_type_');
        switch ($type){
            case '1':
                $title='Продам ';
                break;

            case '2':
                $title='Куплю ';
                break;

            case '3':
                $title='Сдам ';
                break;

            case '4':
                $title='Сниму ';
                break;
        }
        $room=\frontend\models\Items::getPropLabel($id, '_room_');
        $title.=$room.'-комнатную ';
        $name_obj=\frontend\models\Items::getPropLabel($id, '_name_obj_');
        switch ($name_obj){
            case '1':
                $title.='квартиру, ';
                break;

            case '2':
                $title.='дом, ';
                break;

            case '3':
                $title.='дачу, ';
                break;

            case '3':
                $title.='комнату, ';
                break;
        }
        return substr($title, 0,-2);
    }

    public function error($error){
        $html='<div>Были обнаружены такие ошибки:</div>';
        $html.='<ul>';
        foreach ($error as $er){
            $html.='<li>'.$er.'</li>';
        }
        $html.='</ul>';

        return $html;
    }

    public function pref($id, $name){
        return self::str2url($name).'-'.$id;
    }

    public function rowDraw($row, $fix_value = false){
        if ($row['id']!=36) {
            if (!isset($_GET['id'])) {
                $exit_item = Items::findOne(['user' => Yii::$app->user->identity->id, 'status' => -1]);
            } else {
                $exit_item = Items::findOne(Yii::$app->request->get('id'));
            }
            $exit_prop = ItemProp::findOne(['item_id' => $exit_item['id'], 'row_id' => $row['id']]);
            if (empty($exit_prop)) {
                $text = '';
            } else {
                $text = $exit_prop['value'];
            }
            switch ($row['type']) {
                case '1':
                    if ($row['name'] == 'Адрес') {
                        ?>
                        <div id="map"></div>
                        <script type="text/javascript"
                                src="//maps.googleapis.com/maps/api/js?key=AIzaSyBsBxH7Lu3-agjC_EH3YjSsEdc2e9ni5MQ&libraries=places"></script>
                        <script type="text/javascript" src="/vendor/gmaps.js"></script>
                        <script>
                            var map = new GMaps({
                                div: '#map',
                                lat: 47.834946,
                                lng: 35.169854
                            });
                        </script>
                        <div class="maps-input">
                            <div class="row clearfix">
                                <label class="col-md-6 col-md-offset-3">Адрес квартиры (город, улица, дом).<br/>
                                    Введите адрес или передвиньте метку на нужное место<span>*</span></label>
                            </div>
                            <div class="row clearfix">
                                <div class="col-md-6 col-md-offset-3">
                                    <div class="row clearfix white-bg">
                                        <div class="col-md-4">
                                            <select class="styled-select" name="Maps[region]" data-name="region"
                                                    data-search="true">
                                                <option value="">Область</option>
                                                <?php
                                                foreach (GeoRegion::find()->orderBy('name')->all() as $region) {
                                                    ?>
                                                    <option value="<?= $region['id'] ?>"><?= $region['name'] ?></option>
                                                    <?php
                                                }
                                                ?>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <select class="styled-select" name="Maps[city]" data-name="city"
                                                    data-search="true">
                                                <option value="">Город</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <select class="styled-select" name="Maps[area]" data-name="area"
                                                    data-search="true">
                                                <option value="">Район</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row clearfix">
                                <div class="col-md-4 col-md-offset-3">
                                    <input value="<?= $text ?>" id="address-input" placeholder="Улица" data-input="rows"
                                           data-id="<?= $row['id'] ?>" type="text"
                                           class="styled-input" <? if ($row['required'] == 1) echo 'required'; ?>
                                           name="Rows[<?= $row['id'] ?>]" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>>
                                </div>
                                <?php
                                $text = \frontend\models\Items::getPropLabel($exit_item['id'], '_home_');
                                ?>
                                <div class="col-md-2">
                                    <input value="<?= $text ?>" placeholder="№ дома" data-input="rows" data-id="<?= $row['id'] ?>"
                                           type="text"
                                           class="styled-input" required id="home-input"
                                           name="Rows[36]" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>>
                                </div>
                            </div>
                        </div>
                        <?php
                    } else {
                        $value = $text;
                        if (!Yii::$app->user->isGuest) {
                            if ($row['name'] == 'Как к вам обращаться?') {
                                $value = Yii::$app->user->identity->name;
                            }

                            if ($row['name'] == 'Телефон') {
                                $value = Yii::$app->user->identity->username;
                            }
                        }
                        ?>
                        <div class="styled-input-row row clearfix">
                            <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                    <span>*</span><?php } ?></label>
                            <div class="col-md-4">
                                <input data-input="rows" data-id="<?= $row['id'] ?>" value="<?= $value ?>" type="text"
                                       class="styled-input" <? if ($row['required'] == 1) echo 'required'; ?>
                                       name="Rows[<?= $row['id'] ?>]" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?> <?= $row['attr'] ?>>
                            </div>
                        </div>
                        <?php
                    }
                    break;

                case '2':
                    if ($fix_value === false) {
                        $parent_prop = ItemProp::findOne(['item_id' => $exit_item['id'], 'row_id' => $row['sub']]);
                        if (empty($parent_prop)) {
                            $variants = \backend\models\RowValues::find()->where('input_id=:input_id and sub=0', ['input_id' => $row['id']])->all();
                        } else {
                            $variants = \backend\models\RowValues::find()->where('input_id=:input_id and (sub=0 or sub=:sub)', ['input_id' => $row['id'], 'sub' => $parent_prop['value']])->all();
                        }
                    } else {
                        $variants = \backend\models\RowValues::find()->where('input_id=:input_id and (sub=0 or sub=:sub)', ['input_id' => $row['id'], 'sub' => $fix_value])->all();
                    }
                    if (count($variants) <= 5) {
                        ?>
                        <div class="styled-input-row row clearfix">
                            <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                    <span>*</span><?php } ?></label>
                            <div class="col-md-6">
                                <div class="btn-group full-btn-group" data-toggle="buttons">
                                    <?php
                                    foreach ($variants as $variant) {
                                        ?>
                                        <label class="btn btn-white <?php if ($text == $variant['value']) echo 'active'; ?>" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                               data-id="<?= $row['id'] ?>">
                                            <input data-id="<?= $row['id'] ?>"
                                                   type="radio" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                                   name="Rows[<?= $row['id'] ?>]"
                                                   id="radio<?= $variant['id'] ?>" <?php if ($text == $variant['value']) echo 'checked'; ?>
                                                   autocomplete="off" data-input="rows"
                                                   value="<?php echo $variant['value'] ?>" <?= $row['attr'] ?>> <?= $variant['label'] ?>
                                        </label>
                                    <?php } ?>
                                </div>
                            </div>
                        </div>
                        <?php
                    } else {
                        ?>
                        <div class="styled-input-row row clearfix">
                            <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                    <span>*</span><?php } ?></label>
                            <div class="col-md-9">
                                <?php
                                foreach ($variants as $variant) {
                                    ?>
                                    <div class="styled-checkbox">
                                        <input <?php if ($text == $variant['value']) echo 'checked'; ?>
                                                data-id="<?= $row['id'] ?>"
                                                data-input="rows" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                                data-id="<?= $row['id'] ?>" id="check<?= $variant['id'] ?>" type="radio"
                                                name="Rows[<?= $row['id'] ?>][]"
                                                value="<?= $variant['value'] ?>" <? if ($row['required'] == 1) echo 'required'; ?> <?= $row['attr'] ?>>
                                        <label for="check<?= $variant['id'] ?>"><?= $variant['label'] ?></label>
                                    </div>
                                <? } ?>
                            </div>
                        </div>
                        <?php
                    }
                    break;

                case '3':
                    ?>
                    <div class="styled-input-row row clearfix">
                        <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                <span>*</span><?php } ?></label>
                        <div class="col-md-9">
                            <?php
                            if ($text != '') {
                                $text = json_decode($text);
                            } else {
                                $text = [];
                            }
                            $variants = \backend\models\RowValues::find()->where(['input_id' => $row['id']])->all();
                            foreach ($variants as $variant) {
                                ?>
                                <div class="styled-checkbox">
                                    <input <?php if (in_array($variant['value'], $text)) echo 'checked'; ?>
                                            data-id="<?= $row['id'] ?>"
                                            data-input="rows" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                            data-id="<?= $row['id'] ?>" id="check<?= $variant['id'] ?>" type="checkbox"
                                            name="Rows[<?= $row['id'] ?>][]"
                                            value="<?= $variant['value'] ?>" <? if ($row['required'] == 1) echo 'required'; ?> <?= $row['attr'] ?>>
                                    <label for="check<?= $variant['id'] ?>"><?= $variant['label'] ?></label>
                                </div>
                            <? } ?>
                        </div>
                    </div>
                    <?php
                    break;

                case '4':
                    ?>
                    <div class="styled-input-row">
                        <label class="styled-label"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                <span>*</span><?php } ?></label>
                        <div class="styled-input-col">
                            <div class="date-col">
                                <select <?= $row['attr'] ?> data-id="<?= $row['id'] ?>"
                                                            data-input="rows" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                                            data-id="<?= $row['id'] ?>" class="styled-select"
                                                            name="Rows[<?= $row['id'] ?>]" <? if ($row['required'] == 1) echo 'required'; ?>>
                                    <option value="">--</option>
                                    <?php
                                    $variants = \backend\models\RowValues::find()->where(['input_id' => $row['id']])->all();
                                    foreach ($variants as $variant) {
                                        ?>
                                        <option value="<?= $variant['value'] ?>"><?= $variant['label'] ?></option>
                                    <? } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <?php
                    break;

                case '5':
                    if ($text != '') {
                        $text = json_decode($text);
                    } else {
                        $text = [];
                    }
                    ?>
                    <div class="styled-input-row">
                        <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                <span>*</span><?php } ?></label>
                        <div class="col-md-5 clearfix" data-name="Rows[<?= $row['id'] ?>][]"
                             data-role="box-to-upload" data-container="<?= $row['id'] ?>">
                            <?php
                            foreach ($text as $pic) {
                                ?>
                                <div class="load-files"><img src="<?= $pic ?>"><input type="hidden" value="<?= $pic ?>"
                                                                                      name="Rows[<?= $row['id'] ?>][]"><i
                                            class="fa fa-times-circle-o"></i></div>
                                <?php
                            }
                            if ($row['id']==30){
                                for ($m = count($text); $m < 1; $m++) {
                                    ?>
                                    <div class="load-files disabled-sort">
                                        <a href="javascript:void(0)"
                                           onclick="$(this).next().click();"><i class="fa fa-plus-circle"></i> </a>
                                        <input <?= $row['attr'] ?> data-id="<?= $row['id'] ?>" data-input="rows"
                                                                   class="input-load-image" type="file" data-role="upload"
                                                                   multiple>
                                    </div>
                                <?php }
                            } else {
                            for ($m = count($text); $m < 8; $m++) {
                                ?>
                                <div class="load-files disabled-sort">
                                    <a href="javascript:void(0)"
                                       onclick="$(this).next().click();"><i class="fa fa-plus-circle"></i> </a>
                                    <input <?= $row['attr'] ?> data-id="<?= $row['id'] ?>" data-input="rows"
                                                               class="input-load-image" type="file" data-role="upload"
                                                               multiple>
                                </div>
                            <?php } } ?>
                        </div>
                    </div>
                    <?php
                    break;

                case '7':
                    ?>
                    <div class="styled-input-row row clearfix">
                        <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                <span>*</span><?php } ?></label>
                        <div class="col-md-9">
                            <textarea <?= $row['attr'] ?> data-id="<?= $row['id'] ?>"
                                                          data-input="rows" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                                          rows="10"
                                                          class="styled-textarea" <? if ($row['required'] == 1) echo 'required'; ?>
                                                          name="Rows[<?= $row['id'] ?>]"><?= $text ?></textarea>
                        </div>
                    </div>
                    <?php
                    break;

                case '8':
                    ?>
                    <div class="styled-input-row row clearfix">
                        <label class="col-md-3 text-right"><?= $row['name'] ?><?php if ($row['required'] == 1) { ?>
                                <span>*</span><?php } ?></label>
                        <div class="col-md-2">
                            <input <?= $row['attr'] ?> data-id="<?= $row['id'] ?>" value="<?= $text ?>"
                                                       data-input="rows" <? if ($row['hock'] != '') echo 'data-hock="' . $row['hock'] . '"'; ?>
                                                       type="text" data-js="only-number"
                                                       class="styled-input" <? if ($row['required'] == 1) echo 'required'; ?>
                                                       name="Rows[<?= $row['id'] ?>]">
                            <span class="counter-span-minus"><i class="fa fa-minus"></i></span>
                            <span class="counter-span-plus"><i class="fa fa-plus"></i></span>
                        </div>
                    </div>
                    <?php
                    break;
            }
        }
    }

    public function generatePassword(){
        $abetka='qwertyuiopasdfghjkl1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
        $pass='';
        for ($i=0;$i<6;$i++){
            $pass.=$abetka[rand(0,strlen($abetka)-1)];
        }

        return $pass;
    }
}