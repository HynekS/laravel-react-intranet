<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Eloquent::unguard();

        $path = 'pueblo-opscz01.sql';

        DB::unprepared(file_get_contents($path));

        $this->command->info('DB was succesfully seeded!');
    }
}
