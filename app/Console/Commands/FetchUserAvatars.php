<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Support\Facades\{Storage, Http};
use Illuminate\Console\Command;

class FetchUserAvatars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fetchavatars';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch user avatars and save them to storage and database';

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
        $directory = "users/";

        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        foreach (User::all() as $user) {

            $response = Http::get("https://avatars.dicebear.com/api/avataaars/" . $user->full_name . ".svg?mouth[]=smile");
            $contents = $response->getBody()->getContents();

            try {
                Storage::disk('public')->put("{$directory}/user_{$user->id}_avatar.svg", $contents);
                $user->avatar_path = "users/user_{$user->id}_avatar.svg";
                $user->save();
            } catch (\Exception $e) {
                dd($e);
            }
        }
        return 0;
    }
}
