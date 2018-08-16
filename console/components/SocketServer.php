<?php
namespace console\components;

use common\models\User;
use frontend\models\Messages;
use frontend\models\Users;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class SocketServer implements MessageComponentInterface
{
    protected $clients;
    public function __construct()
    {
        $this->clients = new \SplObjectStorage; // Для хранения технической информации об присоединившихся клиентах используется технология SplObjectStorage, встроенная в PHP
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg);
        switch ($data->action){
            case 'start':
                $id = $from->resourceId;
                $user = User::findOne(['id'=>$data->user]);
                $user->chat_id = $id;
                $user->save();
                break;

            case 'sms':
                date_default_timezone_set('Europe/Kiev');
                $message = new Messages();
                $message->from_user = $data->user_from;
                $message->to_user = $data->user_to;
                $message->data = date("Y-m-d H:i:s");
                if (isset($data->file)){
                    $message->text = '<data class="file" data-href="'.$data->file.'">'.$data->text.'</div>';
                } else {
                    $message->text = $data->text;
                }
                $message->status = 0;
                $message->save();

                $send = User::findOne($data->user_to);
                foreach ($this->clients as $client){
                    if ($send['chat_id']==$client->resourceId){
                        $client->send(json_encode(['text'=>$message->text, 'data'=>date("H:i d.m.Y", strtotime($message->data))]));
                    }
                }
                break;
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}