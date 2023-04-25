<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveNullFromNalezField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('akce', function (Blueprint $table) {
            // Hacky fix, see https://github.com/laravel/framework/issues/8840#issuecomment-172570594
            $table->smallInteger('nalez')->tinyInteger('nalez')->default(2)->change();
           
        });
        DB::update(
            "UPDATE `akce`
            SET `nalez` = 2
            WHERE `nalez` IS NULL;"
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('akce', function (Blueprint $table) {
            $table->integer('nalez')->default(null)->change();
        });
        DB::update(
            "UPDATE `akce`
            SET `nalez` = null
            WHERE  `nalez` = 2;"
        );
    }
}
