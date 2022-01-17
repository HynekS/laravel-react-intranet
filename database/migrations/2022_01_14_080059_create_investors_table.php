<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateInvestorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $out = new \Symfony\Component\Console\Output\ConsoleOutput();
        $out->writeln("Creating a separate 'investors' table. This may take some time!");

        DB::unprepared("
            CREATE TABLE investor (
                id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
                nazev VARCHAR(255) NOT NULL,
                adresa VARCHAR(255),
                ico VARCHAR(36),
                PRIMARY KEY (id)
            ) CHARACTER SET utf8 COLLATE utf8_czech_ci,
            ENGINE = InnoDB;           
            
            INSERT INTO investor (nazev, adresa, ico)
            SELECT investor_jmeno,
                investor_adresa,
                investor_ico
            FROM akce;
            
            CREATE TABLE investor_copy LIKE investor;
            
            INSERT investor_copy
            SELECT *
            FROM investor;
            
            DELETE
            FROM investor
            WHERE id NOT IN
                (SELECT MIN(id)
                FROM investor_copy
                GROUP BY nazev, adresa);
            
            DROP TABLE investor_copy;
            
            CREATE TABLE akce_investor
            SELECT akce.id_akce AS akce_id,
                investor.id AS investor_id
            FROM akce
            LEFT JOIN investor ON akce.investor_jmeno = investor.nazev
            AND akce.investor_adresa = investor.adresa
            AND akce.investor_ico = investor.ico;
            
            ALTER TABLE akce_investor ADD COLUMN id int(10) unsigned PRIMARY KEY AUTO_INCREMENT;
            
            ALTER TABLE `akce_investor` ADD CONSTRAINT `akce_fk`
            FOREIGN KEY (`akce_id`) REFERENCES `akce` (`id_akce`);
            
            ALTER TABLE `akce_investor` ADD CONSTRAINT `investor_fk`
            FOREIGN KEY (`investor_id`) REFERENCES `investor` (`id`);
        ");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('investors');
    }
}
