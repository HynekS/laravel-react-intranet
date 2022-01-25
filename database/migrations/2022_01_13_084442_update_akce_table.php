<?php

use Illuminate\Database\Migrations\Migration;

class UpdateAkceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $sql_mode = DB::statement("SELECT @@sql_mode");

        DB::unprepared("
            SET sql_mode = '';

            UPDATE `akce` SET `nazev_akce` = TRIM(`nazev_akce`);

            ALTER TABLE `akce` MODIFY `nz_vlozeno` TIMESTAMP NULL;
            ALTER TABLE `akce` MODIFY `zaa_vlozeno` TIMESTAMP NULL;
            ALTER TABLE `akce` MODIFY `teren_databaze_vlozeno` TIMESTAMP NULL;
            ALTER TABLE `akce` MODIFY `LAB_databaze_vlozeno` TIMESTAMP NULL;

            UPDATE `akce`
            SET `nz_vlozeno` = NULL
            WHERE `nz_vlozeno` = '0000-00-00 00:00:00';
            
            UPDATE `akce`
            SET `zaa_vlozeno` = NULL
            WHERE `zaa_vlozeno` = '0000-00-00 00:00:00';
            
            UPDATE `akce`
            SET `teren_databaze_vlozeno` = NULL
            WHERE `teren_databaze_vlozeno` = '0000-00-00 00:00:00';
            
            UPDATE `akce`
            SET `LAB_databaze_vlozeno` = NULL
            WHERE `LAB_databaze_vlozeno` = '0000-00-00 00:00:00';
          
            UPDATE `akce`
            SET `cislo_per_year` = `c_akce`;

            ALTER TABLE `akce` MODIFY `rok_per_year` VARCHAR(20) null;

            UPDATE `akce`
            SET rok_per_year = CONCAT('20', SUBSTRING_INDEX(c_akce, '/', -1));

            ALTER TABLE `akce`
	        CHANGE COLUMN `rok_per_year` `rok_per_year` INT NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `cislo_per_year`;

            ALTER TABLE `akce` MODIFY COLUMN `EL_lokalita` VARCHAR(120) AFTER `datum_vytvoreni`;
            ALTER TABLE `akce` MODIFY COLUMN `EL_datum` VARCHAR(120) AFTER `el_ulozeni`;

            ALTER TABLE `akce`
	        CHANGE COLUMN `registrace_info` `registrace_info` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `registrovano_bit`;

            ALTER TABLE `akce`
	        CHANGE COLUMN `user_id` `owner_id` INT(11) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `datum_ukonceni`;

            /* TODO: Should probably updated ALL empty values to null (in all the columns) */
            UPDATE `akce`
            SET `registrace_info` = NULL WHERE `registrace_info` = '';

            SET sql_mode = {$sql_mode};
        ");
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
