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
                        <button data-toggle="dropdown" class="btn btn-info dropdown-toggle">Состояние: <?=isset($_GET['status'])?\backend\models\ItemStatus::findOne($_GET['status'])['name']:'Все';?> <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                            <li><a href="javascript:void(0);" onclick="action.filter('status', '');">Все</a></li>
                            <?php
                            foreach (\backend\models\ItemStatus::find()->all() as $source){
                                ?>
                                <li><a href="javascript:void(0);" onclick="action.filter('status', <?=$source['id']?>);"><?=$source['name']?></a></li>
                            <?php } ?>
                        </ul>
                    </div>

                    <div class="btn-group pull-right" style="margin-left: 20px;">
                        <button data-toggle="dropdown" class="btn btn-info dropdown-toggle">Метка: <?=isset($_GET['label'])?\backend\models\Labels::findOne($_GET['label'])['name']:'Все';?> <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                            <li><a href="javascript:void(0);" onclick="action.filter('label', '');">Все</a></li>
                            <?php
                            foreach (\backend\models\Labels::find()->all() as $source){
                                ?>
                                <li><a href="javascript:void(0);" onclick="action.filter('label', <?=$source['id']?>);"><?=$source['name']?></a></li>
                            <?php } ?>
                        </ul>
                    </div>

                    <div class="btn-group pull-right" style="margin-left: 20px;">
                        <button data-toggle="dropdown" class="btn btn-info dropdown-toggle">Источник: <?=isset($_GET['source'])?\backend\models\ItemSource::findOne($_GET['source'])['name']:'Все';?> <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                            <li><a href="javascript:void(0);" onclick="action.filter('source', '');">Все</a></li>
                            <?php
                            foreach (\backend\models\ItemSource::find()->all() as $source){
                            ?>
                            <li><a href="javascript:void(0);" onclick="action.filter('source', <?=$source['id']?>);"><?=$source['name']?></a></li>
                            <?php } ?>
                        </ul>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover dataTables-example" >
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Имя</th>
                                <th>Телефон</th>
                                <th>Состояние</th>
                                <th>Метка</th>
                                <th>Источник</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php
                            foreach ($items as $item){
                            ?>
                            <tr class="gradeX">
                                <td><?=$item['id']?></td>
                                <td><?=\common\models\Helper::titleFormat($item['id'])?></td>
                                <td><?=\frontend\models\Items::getPropLabel($item['id'], '_username_')?></td>
                                <td><?=\frontend\models\Items::getPropLabel($item['id'], '_phone_')?></td>
                                <td><?=\backend\models\ItemStatus::findOne($item['status'])['name']?></td>
                                <td>
                                    <?
                                    $l = \backend\models\Labels::findOne($item['label']);
                                    ?>
                                    <span class="label <?=$l['class']?>"><?=$l['name']?></span>
                                </td>
                                <td><?=\backend\models\ItemSource::findOne($item['source'])['name']?></td>
                                <td style="width: 100px">
                                    <a class="btn btn-info" onclick="item.edit(<?=$item['id']?>);"><i class="fa fa-pencil"></i></a>
                                    <button class="btn btn-danger" data-toggle="delete" data-id="<?= $item['id'] ?>" data-table="<?= $table ?>"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                            <?php } ?>
                            </tbody>
                            <tfoot>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Имя</th>
                                <th>Телефон</th>
                                <th>Состояние</th>
                                <th>Метка</th>
                                <th>Источник</th>
                                <th></th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <?= \backend\widget\Nav::widget(['table'=>$table, 'active'=>Yii::$app->request->get('page')?Yii::$app->request->get('page'):1]); ?>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal inmodal fade" id="edit-item" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <form id="save-item-prop" class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">Радектирование объявления</h4>
            </div>
            <div class="modal-body">

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-white" data-dismiss="modal">Отмена</button>
                <button type="button" onclick="item.save();" class="btn btn-primary">Сохранить</button>
            </div>
        </form>
    </div>
</div>