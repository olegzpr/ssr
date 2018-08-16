<?php
$this->title=$title;
if (!isset($_REQUEST['sort'])) {
    $cookies = Yii::$app->response->cookies;
    $cookies->remove('statusUrl');
}

$lang=\backend\models\Help::Lang();
?>
<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <h2><?= $this->title ?></h2>
        <ol class="breadcrumb">
            <li>
                <a href="<?= Yii::$app->homeUrl ?>"><?= $lang->index ?></a>
            </li>
            <li class="active">
                <strong><?= $this->title ?></strong>
            </li>
        </ol>
    </div>
    <div class="col-lg-2">

    </div>
</div>
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title clearfix">
                    <div class="row pull-left col-md-6">
	                    <div class="col-md-3"><a href="<?= Yii::$app->request->getUrl() ?>/add" class="btn btn-info pull-left"><?= $lang->add_button ?></a></div>
	                    <div class="col-md-9">
		                    <form method="get" action="<?= Yii::$app->request->getUrl() ?>">
			                    <div class="col-md-9"><input type="text" name="q" placeholder="<?= $lang->search ?>" class="form-control"></div>
			                    <div class="col-md-3"><button  class="btn btn-success"><i class="fa fa-search"></i></button></div>
		                    </form>
	                    </div>
                    </div>
                    <div class="btn-group pull-right" style="margin-left: 20px;">
                        <button data-toggle="dropdown" class="btn btn-info dropdown-toggle"><?= $lang->sort_by ?> <?= isset($_REQUEST['sort'])?$label[$_REQUEST['sort']]:'ID' ?> <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                            <?php
                            foreach ($rows as $row){
                            if ($row['display']==1){
                                ?>
                                <li><a href="javascript:void(0);" onclick="action.sort('<?= $row['name'] ?>');"><?= $lang->sort_by ?> <?= $label[$row['name']] ?></a></li>
                            <?php } } ?>
                        </ul>
                    </div>
                    <?php
                    if (!empty($action)){
                    ?>
                    <div class="btn-group pull-right">
                        <button data-toggle="dropdown" class="btn btn-primary dropdown-toggle"><?= $lang->action ?> <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                            <?php
                            foreach ($action as $key=>$value){
                            ?>
                            <li><a href="javascript:void(0);" onclick="action.<?= $key ?>('<?= $table ?>');"><?= $value ?></a></li>
                            <?php } ?>
                        </ul>
                    </div>
                    <?php } ?>
                </div>
                <div class="ibox-content">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover dataTables-example" >
                            <thead>
                            <tr>
                                <th><input data-toggle="selectAllInput" type="checkbox"></th>
                                <?php
                                foreach ($rows as $row){
                                    if ($row['display']==1){
                                ?>
                                <th><?= $label[$row['name']] ?></th>
                                <? } } ?>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php
                            foreach ($data as $line){
                            ?>
                            <tr class="gradeX">
                                <td><input data-toggle="selectForAction" type="checkbox" value="<?= $line['id'] ?>"></td>
                                <?php
                                foreach ($rows as $row){
                                    if ($row['display']==1){
                                        if ($row['type']=='select'){
                                            if (!empty($row['table'])) {
                                                $text = \backend\models\Help::getSelect($row['table'], $line[$row['name']]);
                                            } else {
                                                $text=$row['data'][$line[$row['name']]];
                                            }
                                        } else if ($row['type']=='url'){
                                            $obj=(new \yii\db\Query())
                                                ->select('*')
                                                ->from($row['table']['name'])
                                                ->where($row['table']['value']."='".$line[$row['name']]."'")
                                                ->one();
                                            preg_match_all('|\[(.*?)\]|is', $row['attr']['tpl'], $tmp);
                                            $url=$row['attr']['tpl'];
                                            foreach ($tmp[1] as $str){
                                                $db=explode(':', $str);
                                                $res=(new \yii\db\Query())
                                                    ->select('*')
                                                    ->from($db[3])
                                                    ->where($db[1]."='".$obj[$db[0]]."'")
                                                    ->one();
                                                $url=str_replace('['.$str.']', $res[$db[2]], $url);
                                            }
                                            $text='<a href="'.$url.'" target="blank">'.\backend\models\Help::getSelect($row['table'], $line[$row['name']]).'</a>';
                                        } else if ($row['type']=='datepicker'){
                                            $d=new DateTime($line[$row['name']]);
                                            $text=$d->format("d.m.Y");
                                        } else {
                                            $text=$line[$row['name']];
                                        }
                                        ?>
                                        <?php if (!empty($row['attr']['liveedit'])){
                                            ?>
                                            <td data-toggle="liveedit" data-table="<?= $table ?>" data-input="<?= $row['name'] ?>" data-id="<?= $line['id'] ?>" contentEditable="true" data-token="<?=Yii::$app->request->getCsrfToken()?>"><?= $text ?></td>
                                            <?
                                        } else {
                                            ?>
                                            <td><?= $text ?></td>
                                            <? } ?>
                                    <? } } ?>
                                <td style="width: 100px">
                                    <a class="btn btn-info" href="<? $url=explode('?', Yii::$app->request->getUrl()); echo $url[0]; ?>/edit/<?= $line['id'] ?>"><i class="fa fa-pencil"></i></a>
                                    <button class="btn btn-danger" data-toggle="delete" data-id="<?= $line['id'] ?>" data-table="<?= $table ?>"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                            <?php } ?>
                            </tbody>
                            <tfoot>
                            <tr>
                                <th><input data-toggle="selectAllInput" type="checkbox"></th>
                                <?php
                                foreach ($rows as $row){
                                    if ($row['display']==1){
                                        ?>
                                        <th><?= $label[$row['name']] ?></th>
                                    <? } } ?>
                                <th></th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <?= \backend\widget\Nav::widget(['table'=>$table, 'active'=>1]); ?>
                </div>
            </div>
        </div>
    </div>
</div>