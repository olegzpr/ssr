<div class="wrapper wrapper-content animated fadeIn">

    <div class="p-w-md m-t-sm">
        <div class="row">
            <div class="col-lg-6">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>Статистика посещений</h5>
                    </div>
                    <div class="ibox-content">
                        <div>
                            <canvas id="lineChart" height="140"></canvas>
                        </div>
                    </div>
                    <?php
                    $data=\common\models\Analitics::get7day();
                    $data2=\common\models\Analitics::top5();
                    ?>
                    <script>
                        $(function () {
                            var lineData = {
                                labels: ['<?= implode("','", $data['label']) ?>'],
                                datasets: [

                                    {
                                        label: "Уникальный посещений",
                                        backgroundColor: 'rgba(197, 16, 22, 0.5)',
                                        borderColor: "rgba(197, 16, 22, 0.7)",
                                        pointBackgroundColor: "rgba(197, 16, 22, 1)",
                                        pointBorderColor: "#fff",
                                        data: [<?= implode(',', $data['data']) ?>]
                                    }
                                ]
                            };

                            var lineOptions = {
                                responsive: true
                            };


                            var ctx = document.getElementById("lineChart").getContext("2d");
                            new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});
                        })
                    </script>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>Топ 5 страниц</h5>
                    </div>
                    <div class="ibox-content">
                        <div>
                            <canvas id="barChart" height="140"></canvas>
                        </div>
                    </div>
                    <script>
                        $(function () {
                            var barData = {
                                labels: ['<?= implode("','", $data2['label']) ?>'],
                                datasets: [
                                    {
                                        label: "За последние 7 дней",
                                        borderColor: "rgba(197, 16, 22, 0.7)",
                                        backgroundColor: 'rgba(197, 16, 22, 0.62)',
                                        pointBorderColor: "#fff",
                                        data: [<?= implode(",", $data2['data']) ?>]
                                    }
                                ]
                            };

                            var barOptions = {
                                responsive: true
                            };


                            var ctx2 = document.getElementById("barChart").getContext("2d");
                            new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
                        })
                    </script>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-lg-12">
                <div class="ibox">
                    <div class="ibox-content">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Тема</th>
                                    <th>Телефон</th>
                                    <th>E-mail</th>
                                    <th>Дата и время</th>
                                    <th>IP</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php
                                foreach ($orders as $order){
                                ?>
                                <tr>
                                    <td><?= $order['id'] ?></td>
                                    <td><?= $order['type'] ?></td>
                                    <td><?= $order['phone'] ?></td>
                                    <td><?= $order['email'] ?></td>
                                    <td><?= date("H:i d.m.Y", strtotime($order['data'])) ?></td>
                                    <td><?= $order['ip'] ?></td>
                                    <td>
                                        <form action="/admin/delete-order" method="post">
                                            <input type="hidden" name="_csrf" value="<?=Yii::$app->request->getCsrfToken()?>" />
                                            <input type="hidden" value="<?=$order['id']?>" name="id">
                                            <button class="btn btn-danger">удалить</button>
                                        </form>
                                    </td>
                                </tr>
                                <? } ?>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>


</div>