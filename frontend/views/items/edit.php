<?php
$this->title='Редактировать объявление';
$this->params['page']='/items';
use yii\helpers\Html;
?>
<div class="container" style="padding: 30px;">
    <?php $form=\yii\bootstrap\ActiveForm::begin(['options'=>['class'=>'styled-form']]); ?>

        <div class="dash-content-limiter" style="padding-bottom: 30px">
            <div class="dashboard-page-title">Категория</div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="styled-input-row">
                        <label class="styled-label">Выберите категорию</label>
                        <div class="styled-input-col">
                            <div class="date-col">
                                <select class="styled-select" name="Define[category]">
                                    <option value="">--</option>
                                    <?php
                                    foreach ($category as $cat){
                                        ?>
                                        <option <? if ($cat['id']==$item['category']) echo 'selected';?> value="<?=$cat['id']?>"><?=$cat['name']?></option>
                                    <? } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php
            $steps=\backend\models\Steps::find()->all();
            foreach ($steps as $step){
            ?>
            <div class="dashboard-page-title"><?=$step['name']?></div>
            <div class="row">
                <div class="col-sm-12">
                    <?php
                    $rows=\backend\models\Rows::find()->where(['step_id'=>$step['id']])->all();
                    foreach ($rows as $row){
                        $value=\backend\models\ItemProp::find()->where(['item_id'=>$item['id'], 'row_id'=>$row['id']])->one();
                        switch ($row['type']){
                            case '1':
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col">
                                        <input type="text" class="styled-input" <? if ($row['required']==1) echo 'required'; ?> name="Rows[<?=$row['id']?>]" value="<?=$value['value']?>">
                                    </div>
                                </div>
                                <?php
                                break;

                            case '2':
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col">
                                        <?php
                                        $variants=\backend\models\RowValues::find()->where(['input_id'=>$row['id']])->all();
                                        foreach ($variants as $variant){
                                        ?>
                                        <div class="styled-radio inline">
                                            <input type="radio" id="radio<?=$variant['id']?>" name="Rows[<?=$row['id']?>]" value="<?=$variant['value']?>" <? if ($variant['value']==$value['value']) echo 'checked'; ?> <? if ($row['required']==1) echo 'required'; ?>>
                                            <label for="radio<?=$variant['id']?>"><?=$variant['label']?></label>
                                        </div>
                                        <? } ?>
                                    </div>
                                </div>
                                <?php
                                break;

                            case '3':
                                $vals=json_decode($value['value']);
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col">
                                        <?php
                                        $variants=\backend\models\RowValues::find()->where(['input_id'=>$row['id']])->all();
                                        foreach ($variants as $variant){
                                        ?>
                                        <div class="styled-checkbox">
                                            <input id="check<?=$variant['id']?>" type="checkbox" name="Rows[<?=$row['id']?>][]" value="<?=$variant['value']?>" <? if (in_array($variant['value'], $vals)) echo 'checked'; ?> <? if ($row['required']==1) echo 'required'; ?>>
                                            <label for="check<?=$variant['id']?>"><?=$variant['label']?></label>
                                        </div>
                                        <? } ?>
                                    </div>
                                </div>
                                <?php
                                break;

                            case '4':
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col">
                                        <div class="date-col">
                                            <select class="styled-select" name="Rows[<?=$row['id']?>]" <? if ($row['required']==1) echo 'required'; ?>>
                                                <option value="">--</option>
                                                <?php
                                                $variants=\backend\models\RowValues::find()->where(['input_id'=>$row['id']])->all();
                                                foreach ($variants as $variant){
                                                    ?>
                                                    <option <? if ($variant['value']==$value['value']) echo 'selected'; ?> value="<?=$variant['value']?>"><?=$variant['label']?></option>
                                                <? } ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <?php
                                break;

                            case '5':
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col clearfix" data-name="Rows[<?=$row['id']?>][]" data-role="box-to-upload">
                                        <?php
                                        foreach (\common\models\Helper::getPicture($value['value']) as $pic){
                                            ?>
                                            <div class="load-files"><img src="/source/items/<?=$pic?>"><input type="hidden" value="<?=$pic?>" name="Rows[<?=$row['id']?>][]"><i class="fa fa-trash"></i></div>
                                            <?php
                                        }
                                        ?>
                                        <div class="load-files disabled-sort">
                                            <a href="javascript:void(0)" onclick="$(this).next().click();">выбрать</a>
                                            <input type="file" data-role="upload" multiple>
                                        </div>
                                    </div>
                                </div>
                                <?php
                                break;

                            case '7':
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col">
                                        <textarea rows="10" class="styled-textarea" <? if ($row['required']==1) echo 'required'; ?> name="Rows[<?=$row['id']?>]"><?=$value['value']?></textarea>
                                    </div>
                                </div>
                                <?php
                                break;

                            case '8':
                                ?>
                                <div class="styled-input-row">
                                    <label class="styled-label"><?=$row['name']?></label>
                                    <div class="styled-input-col">
                                        <input type="number" value="<?=$value['value']?>" class="styled-input" <? if ($row['required']==1) echo 'required'; ?> name="Rows[<?=$row['id']?>]">
                                    </div>
                                </div>
                                <?php
                                break;
                        }
                    }
                    ?>
                </div>
            </div>
            <? } ?>
            <input type="hidden" value="<?=Yii::$app->user->identity->name ?>" class="styled-input" required name="User[name]">
            <input type="hidden" value="<?=Yii::$app->user->identity->username ?>" class="styled-input" required name="User[phone]">
            <button class="btn btn-primary">Сохранить</button>
    <? \yii\bootstrap\ActiveForm::end() ?>
</div>