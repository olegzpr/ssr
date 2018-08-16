<?php

use yii\db\Migration;

class m170202_135507_admin_roles extends Migration
{
    public function up()
    {
        $this->createTable('roles', [
            'id' => $this->primaryKey(),
            'name' => $this->string(100),
            'allow'=> $this->string(255)
        ]);
    }

    public function down()
    {
        echo "m170202_135507_admin_roles cannot be reverted.\n";

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
