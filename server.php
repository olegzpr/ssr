<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/vendor/yiisoft/yii2/Yii.php';
require __DIR__ . '/frontend/models/Messages.php';

use frontend\models\Messages;

$io = new \PHPSocketIO\SocketIO(2002);

$io->on('connection', function($socket){
    $socket->addedUser = false;
    // when the client emits 'new message', this listens and executes
    $socket->on('new message', function ($message, $user_to, $user_from, $data, $img)use($socket){
        // we tell the client to execute 'new message'
        $sms=new Messages();
        $sms->saveMessage($user_from, $user_to, $message, $data);

        $socket->broadcast->emit('new message', array(
            'message'=> $message,
            'user_to'=> $user_to,
            'user_from'=>$user_from,
            'data'=>$data,
            'img'=>$img
        ));
    });

});

\Workerman\Worker::runAll();