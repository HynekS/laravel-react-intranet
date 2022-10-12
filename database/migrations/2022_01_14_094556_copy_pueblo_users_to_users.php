<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CopyPuebloUsersToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('user_name');
            $table->string('full_name');
            $table->string('email')->nullable()->default(null);
            $table->timestamp('email_verified_at')->nullable()->default(null);
            $table->string('password');
            $table->string('remember_token')->nullable()->default(null);
            $table->timestamps();
            $table->integer('role')->nullable()->default(null);
            $table->integer('active')->nullable()->default(1);
        });

        DB::unprepared("       
            ALTER TABLE `users`
                CHANGE COLUMN `email` `email` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci' AFTER `full_name`;
            
            ALTER TABLE `users`
                CHANGE COLUMN `id` `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT FIRST;
            
            INSERT INTO `users` (`id`, `user_name`, `full_name`, `password`, `created_at`, `updated_at`, `role`, `active`)
            SELECT `id_user`, `username`, CONCAT_WS(' ', `jmeno`, `prijmeni`) AS `full_name`, `password`, `datum_vytvoreni`, `datum_vytvoreni`, `typ_uzivatele`, `active`
            FROM `pueblo_users`;
            
            
            ALTER TABLE `akce`
                CHANGE COLUMN `id_zajistuje` `user_id` INT(11) NULL DEFAULT NULL AFTER `datum_ukonceni`;
            
            ALTER TABLE `akce`
                CHANGE COLUMN `user_id` `user_id` INT(11) UNSIGNED NULL DEFAULT NULL AFTER `datum_ukonceni`;

            UPDATE `akce` SET `user_id` = null WHERE `user_id` = 0;
            
            ALTER TABLE `akce`
                ADD CONSTRAINT `FK_akce_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
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
