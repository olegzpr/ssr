<?php

use yii\db\Migration;

class m170508_091249_add_rows_for_admin extends Migration
{
    public function up()
    {
		$this->addColumn('admin', 'name', $this->string(100));
		$this->addColumn('admin', 'role', $this->integer(11));
    }

    public function down()
    {
        echo "m170508_091249_add_rows_for_admin cannot be reverted.\n";

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
