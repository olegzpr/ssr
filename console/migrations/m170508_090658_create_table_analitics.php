<?php

use yii\db\Migration;

class m170508_090658_create_table_analitics extends Migration
{
    public function up()
    {
		$this->createTable('analitics', [
            'id' => $this->primaryKey(),
            'data' => $this->date(),
            'time'=> $this->time(), 
            'ip'=> $this->string(100),
            'session'=> $this->string(100),
            'country'=> $this->string(100),
            'city'=> $this->string(200),
            'page'=> $this->string(300),
        ]);
    }

    public function down() 
    {
        echo "m170508_090658_create_table_analitics cannot be reverted.\n";

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
