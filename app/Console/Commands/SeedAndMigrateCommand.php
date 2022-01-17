<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SeedAndMigrateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seedandmigrate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to empty database, load a sql dump, run migration and install Passport';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {   
        if ($this->confirm("WARNING! This script will delete all the data from the database. Press 'y' to confirm.")) {
            $this->call("db:wipe"); 
            $this->call("db:seed");
            $this->info("after seed");
            $this->call("migrate");
            $this->call("passport:install");
            $this->info("Database was succesfully migrated!");
        }
        return 0;
    }
}
