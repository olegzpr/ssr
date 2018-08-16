<?php

use yii\db\Migration;

class m170508_090044_create_table_orders extends Migration
{
    public function up()
    {
		$this->createTable('orders', [
            'id' => $this->primaryKey(),
            'phone' => $this->string(20),
            'email'=> $this->string(200),
            'name'=> $this->string(150),
            'data'=> $this->timestamp(),
            'ip'=> $this->string(100),
            'status'=> $this->integer(11)->defaultValue(1),
            'type'=> $this->string(100),
        ]);
    }

    public function down()
    {
        echo "m170508_090044_create_table_orders cannot be reverted.\n"; 

        return false;
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
