<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAvatarFieldToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('users', 'avatar_path'))
        {
            Schema::table('users', function (Blueprint $table)
            {
                $table->dropColumn('avatar_path');
            });
        }
        
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_path')->nullable()->default(null);
        });

        /**
         * Moved to a separate command – but will it work on Lightsail?
         */
        echo "Field added, running seeder";
        
        Artisan::call('fetchavatars');
        
        echo "seeder complete";
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar_path');
        });
    }
}
