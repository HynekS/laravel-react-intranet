<?php

namespace App\Console\Commands;

use App\User;

use Illuminate\Console\Command;

class CreateUserPool extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fakeusers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create and save a pool of fake users';

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
        $userPool = factory(User::class, 15)->make();
        foreach ($userPool as $user) {
            $user->save();
        }

        return 0;
    }
}
