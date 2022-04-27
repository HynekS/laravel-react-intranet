<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePointgroupAndPointTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pointgroups', function (Blueprint $table) {
            $table->id();
            $table->integer('akce_id');
            $table->foreign('akce_id')->references('id_akce')->on('akce');
            $table->enum('type', ['point', 'line', 'polygon'])->default('point');
        });

        Schema::create('points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pointgroup_id')->references('id')->on('pointgroups');
            $table->string('coords_as_string')->nullable();
            $table->float('latitude', 9, 7)->nullable();
            $table->float('longitude', 9, 7)->nullable();
            $table->float('elevation', 7, 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('pointgroups');
        Schema::dropIfExists('points');
        Schema::enableForeignKeyConstraints();
    }
}
