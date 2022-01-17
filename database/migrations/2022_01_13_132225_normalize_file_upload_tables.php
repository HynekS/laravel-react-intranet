<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class NormalizeFileUploadTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared("
            /* Analyza */
            ALTER TABLE `analyzy`	CHANGE COLUMN `id_analyza` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `analyzy`	CHANGE COLUMN `analyza_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* digitalizace_nalez */
            ALTER TABLE `digitalizace_nalez`	CHANGE COLUMN `id_nalze` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `digitalizace_nalez`	CHANGE COLUMN `nalez_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* digitalizace_plany */
            ALTER TABLE `digitalizace_plany`	CHANGE COLUMN `id_plan` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `digitalizace_plany`	CHANGE COLUMN `plan_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* geodet_body */
            ALTER TABLE `geodet_body`	CHANGE COLUMN `id_body` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `geodet_body`	CHANGE COLUMN `body_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* geodet_plany */
            ALTER TABLE `geodet_plany`	CHANGE COLUMN `id_plan` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `geodet_plany`	CHANGE COLUMN `plan_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* kresleni_foto */
            ALTER TABLE `kresleni_foto`	CHANGE COLUMN `id_foto` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `kresleni_foto`	CHANGE COLUMN `foto_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* nz_word */
            ALTER TABLE `nz_word`	CHANGE COLUMN `id_NZ_word` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `nz_word`	CHANGE COLUMN `NZ_word_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* teren_foto */
            ALTER TABLE `teren_foto`	CHANGE COLUMN `id_foto` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `teren_foto`	CHANGE COLUMN `foto_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* teren_negativni_foto */
            ALTER TABLE `teren_negativni_foto`	CHANGE COLUMN `id_foto` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `teren_negativni_foto`	CHANGE COLUMN `foto_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
            
            /* teren_scan */
            ALTER TABLE `teren_scan`	CHANGE COLUMN `id_scan` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
            ALTER TABLE `teren_scan`	CHANGE COLUMN `teren_file` `file_path` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_czech_ci' AFTER `id`;
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
