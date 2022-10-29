<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'maketestuser';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test user with hardcoded password "password"';

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
        factory(User::class)->create([
            'user_name' => 'test',
            'full_name' => "T. E. Strong",
            'password' => Hash::make("password"),
            'role' => rand(2, 5),
            'created_at' => now(),
            'active' => 1, 
        ]);
        $this->info("User with username 'test' and password 'password' was created");
        return 0;
    }
}
