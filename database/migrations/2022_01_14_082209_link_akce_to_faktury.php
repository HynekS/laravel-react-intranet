<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LinkAkceToFaktury extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('faktury', function (Blueprint $table) {
            $table->integer('akce_id')->nullable()->after('info');
            $table->integer('typ_castky')->nullable()->default(null)->after('castka')->change();
        });

        $results = DB::table('faktury')->select('akce_id', 'c_akce')->get();

        foreach ($results as $result) {
            $akce_relations = DB::table('akce')->select(['id_akce', 'c_akce'])->where('c_akce', '=', $result->c_akce)->first();

            DB::table('faktury')
                ->where('c_akce', $akce_relations->c_akce)
                ->update([
                    'akce_id' => $akce_relations->id_akce
                ]);
        }

        Schema::table('faktury', function (Blueprint $table) {
            $table->foreign('akce_id')->references('id_akce')->on('akce')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
