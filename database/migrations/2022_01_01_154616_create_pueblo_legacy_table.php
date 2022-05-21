<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreatePuebloLegacyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('akce')) {
            return;
            // Tables are already set up, no need to create ones
        }

        $sql_mode = DB::statement("SELECT @@sql_mode");

        DB::unprepared("
            SET sql_mode = '';
        ");

        Schema::create('akce', function (Blueprint $table) {
            $table->integer('id_akce', true);
            $table->string('c_akce', 20)->nullable();
            $table->integer('cislo_per_year')->nullable();
            $table->integer('rok_per_year')->nullable();
            $table->string('nazev_akce', 150)->nullable();
            $table->integer('nazev_akce_final')->nullable();
            $table->integer('objednavka')->nullable();
            $table->string('objednavka_cislo', 30)->nullable();
            $table->string('objednavka_info', 30)->nullable();
            $table->integer('smlouva')->nullable();
            $table->string('smlouva_info', 150)->nullable();
            $table->float('rozpocet_A', 10, 0)->nullable();
            $table->integer('rozpocet_A_final')->nullable()->default(0);
            $table->float('fakturovano_A', 10, 0)->nullable();
            $table->float('rozpocet_B', 10, 0)->nullable();
            $table->integer('rozpocet_B_final')->nullable()->default(0);
            $table->float('fakturovano_B', 10, 0)->nullable();
            $table->integer('registrovano_bit')->nullable();
            $table->string('registrace_info', 20);
            $table->integer('id_stav')->nullable();
            $table->string('investor_jmeno', 150)->nullable();
            $table->string('investor_kontakt', 150)->nullable();
            $table->string('investor_adresa', 150)->nullable();
            $table->string('investor_ico', 15)->nullable();
            $table->string('katastr', 50)->nullable();
            $table->string('okres', 50)->nullable();
            $table->integer('nalez')->nullable();
            $table->string('datum_pocatku_text', 40)->nullable();
            $table->string('datum_pocatku', 50)->nullable();
            $table->string('datum_ukonceni', 50)->nullable();
            $table->string('datum_ukonceni_text', 40)->nullable();
            $table->integer('id_zajistuje')->nullable();
            $table->string('kraj', 120)->nullable();
            $table->string('zaa', 150)->nullable();
            $table->integer('zaa_hlaseno')->nullable()->default(0);
            $table->integer('nz_vlozil')->nullable();
            $table->timestamp('nz_vlozeno')->default('0000-00-00 00:00:00');
            $table->integer('zaa_vlozil')->nullable();
            $table->timestamp('zaa_vlozeno')->default('0000-00-00 00:00:00');
            $table->string('NZ', 150)->nullable();
            $table->string('NZ_vytvoril', 120)->nullable();
            $table->integer('hotovo')->nullable();
            $table->timestamp('datum_vytvoreni')->useCurrent();
            $table->string('EL_GPS_1_N', 40)->nullable();
            $table->string('EL_GPS_1_E', 40)->nullable();
            $table->string('EL_GPS_2_N', 40)->nullable();
            $table->string('EL_GPS_2_E', 40)->nullable();
            $table->string('EL_Termin', 20)->nullable();
            $table->string('EL_Forma', 200)->nullable();
            $table->string('EL_Denik')->nullable();
            $table->binary('EL_Dokumentovane')->nullable();
            $table->binary('EL_Movite')->nullable();
            $table->binary('EL_Popis')->nullable();
            $table->integer('EL_hotovo')->nullable();
            $table->string('EL_fotodokumentace')->nullable();
            $table->string('EL_kresebna_a_textova')->nullable();
            $table->string('EL_ulozeni')->nullable();
            $table->string('teren_databaze', 200)->nullable();
            $table->integer('teren_databaze_vlozil')->nullable();
            $table->timestamp('teren_databaze_vlozeno')->default('0000-00-00 00:00:00');
            $table->integer('LAB_umyto')->nullable();
            $table->integer('LAB_popsano')->nullable();
            $table->integer('LAB_datovano')->nullable();
            $table->string('LAB_databaze', 200)->nullable();
            $table->string('EL_datum', 50)->nullable();
            $table->integer('LAB_databaze_vlozil')->nullable();
            $table->timestamp('LAB_databaze_vlozeno')->default('0000-00-00 00:00:00');
            $table->integer('LAB_hotovo')->nullable();
            $table->integer('KR_vybrano')->nullable();
            $table->integer('KR_hotovo')->nullable();
            $table->string('EL_lokalita', 120)->nullable();
            $table->integer('TER_hotovo')->nullable();
            $table->integer('DIG_hotovo')->nullable();
            $table->integer('GEO_hotovo')->nullable();
            $table->integer('ANA_hotovo')->nullable();
            $table->integer('NZW_hotovo')->nullable();
            $table->date('hotovo_datum')->nullable();
        });

        Schema::create('analyzy', function (Blueprint $table) {
            $table->integer('id_analyza', true);
            $table->string('analyza_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('digitalizace_nalez', function (Blueprint $table) {
            $table->integer('id_nalze', true);
            $table->string('nalez_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('digitalizace_plany', function (Blueprint $table) {
            $table->integer('id_plan', true);
            $table->string('plan_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('dopisy_seznam', function (Blueprint $table) {
            $table->integer('id_dopis', true);
            $table->string('kraj', 120)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
            $table->string('investor', 200)->nullable();
            $table->string('objekt', 200)->nullable();
            $table->string('katastralni_urad', 200)->nullable();
            $table->string('datum_odeslani', 1000)->nullable();
            $table->string('text_reakce_inv', 1000)->nullable();
            $table->string('vyzkum', 1000)->nullable();
            $table->string('kontakt', 200)->nullable();
            $table->integer('stav')->nullable();
            $table->string('c_akce', 20)->nullable();
            $table->integer('id_vlozil')->nullable();
        });

        Schema::create('faktury', function (Blueprint $table) {
            $table->integer('id_zaznam', true);
            $table->string('c_akce', 11)->nullable();
            $table->string('c_faktury', 20)->nullable();
            $table->float('castka', 10, 0)->nullable();
            $table->integer('typ_castky');
            $table->timestamp('datum_vlozeni')->useCurrent();
            $table->string('info')->nullable();
        });

        Schema::create('geodet_body', function (Blueprint $table) {
            $table->integer('id_body', true);
            $table->string('body_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('geodet_plany', function (Blueprint $table) {
            $table->integer('id_plan', true);
            $table->string('plan_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('kresleni_foto', function (Blueprint $table) {
            $table->integer('id_foto', true);
            $table->string('foto_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('nz_word', function (Blueprint $table) {
            $table->integer('id_NZ_word', true);
            $table->string('NZ_word_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('pueblo_users', function (Blueprint $table) {
            $table->integer('id_user', true);
            $table->string('username', 20)->nullable();
            $table->string('password', 80)->nullable();
            $table->string('jmeno', 20)->nullable();
            $table->string('prijmeni', 20)->nullable();
            $table->string('typ_uzivatele', 20)->nullable();
            $table->timestamp('datum_vytvoreni')->useCurrent();
            $table->integer('hints')->nullable()->default(0);
            $table->timestamp('last_login')->default('0000-00-00 00:00:00');
            $table->timestamp('last_success')->default('0000-00-00 00:00:00');
            $table->integer('active')->nullable()->default(1);
        });

        Schema::create('pueblo_users_dopisy', function (Blueprint $table) {
            $table->integer('id_user', true);
            $table->string('username', 20)->nullable();
            $table->string('password', 80)->nullable();
            $table->string('jmeno', 20)->nullable();
            $table->string('prijmeni', 20)->nullable();
            $table->string('typ_uzivatele', 20)->nullable();
            $table->timestamp('datum_vytvoreni')->useCurrent();
            $table->integer('hints')->nullable()->default(0);
            $table->timestamp('last_login')->default('0000-00-00 00:00:00');
            $table->timestamp('last_success')->default('0000-00-00 00:00:00');
            $table->integer('active')->nullable()->default(1);
        });

        Schema::create('pueblo_users_role', function (Blueprint $table) {
            $table->integer('id_role', true);
            $table->string('nazev', 50)->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('pueblo_users_role_dopisy', function (Blueprint $table) {
            $table->integer('id_role', true);
            $table->string('nazev', 50)->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('teren_foto', function (Blueprint $table) {
            $table->integer('id_foto', true);
            $table->string('foto_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('teren_negativni_foto', function (Blueprint $table) {
            $table->integer('id_foto', true);
            $table->string('foto_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        Schema::create('teren_scan', function (Blueprint $table) {
            $table->integer('id_scan', true);
            $table->string('teren_file', 150)->nullable();
            $table->integer('id_akce')->nullable();
            $table->string('vlozil', 200)->nullable();
            $table->timestamp('vlozeno')->useCurrent();
        });

        DB::unprepared("SET sql_mode = {$sql_mode};");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teren_scan');

        Schema::dropIfExists('teren_negativni_foto');

        Schema::dropIfExists('teren_foto');

        Schema::dropIfExists('pueblo_users_role_dopisy');

        Schema::dropIfExists('pueblo_users_role');

        Schema::dropIfExists('pueblo_users_dopisy');

        Schema::dropIfExists('pueblo_users');

        Schema::dropIfExists('nz_word');

        Schema::dropIfExists('kresleni_foto');

        Schema::dropIfExists('geodet_plany');

        Schema::dropIfExists('geodet_body');

        Schema::dropIfExists('faktury');

        Schema::dropIfExists('dopisy_seznam');

        Schema::dropIfExists('digitalizace_plany');

        Schema::dropIfExists('digitalizace_nalez');

        Schema::dropIfExists('analyzy');

        Schema::dropIfExists('akce');
    }
}
