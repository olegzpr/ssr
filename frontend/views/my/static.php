<?php
$this->params['page']='';
$this->title='Статистика объявления';
$label1=$data1['label'];
$label2=$data2['label'];
$value1=$data1['value'];
$value2=$data2['value'];
$script = <<< JS
    var config = {
        type: 'line',
        data: {
            labels: ["$label1"],
            datasets: [{
                label: "Просмотры",
                backgroundColor: '#ebebeb',
                borderColor: '#26a65c',
                data: ["$value1"],
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title:{
                display:false,
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Дата'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Значение'
                    }
                }]
            }
        }
    };

    var config2 = {
        type: 'line',
        data: {
            labels: ["$label2"],
            datasets: [{
                label: "Просмотры телефона",
                backgroundColor: '#ebebeb',
                borderColor: '#26a65c',
                data: ["$value2"],
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title:{
                display:false,
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Дата'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Значение'
                    }
                }]
            }
        }
    };
    $(function() {
        var ctx = document.getElementById("graph-1").getContext("2d");
            window.myLine = new Chart(ctx, config);
            
        var ctx = document.getElementById("graph-2").getContext("2d");
            window.myLine2 = new Chart(ctx, config2);
    })
JS;
//маркер конца строки, обязательно сразу, без пробелов и табуляции
$this->registerJs($script, yii\web\View::POS_READY);
?>

<div class="dashboard-content dashboard-padding">
    <div class="row clearfix">
        <div class="col-md-12">
            <h3>Статистика просмотров</h3>
            <canvas id="graph-1" class="chart"></canvas>
        </div>

        <div class="col-md-12">
            <h3>Статистика просмотров телефона</h3>
            <canvas id="graph-2" class="chart"></canvas>
        </div>

        <div class="col-md-12">
            <h3>Статистика добавления в избранное</h3>

        </div>
    </div>
</div>
