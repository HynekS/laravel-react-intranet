<?php

use Illuminate\Database\Migrations\Migration;

class RenameNzWordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE `NZ_word` RENAME `nz_word`;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE `nz_word` RENAME `NZ_word`;");
    }
}
