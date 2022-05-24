<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\User;

class PopulateUserAvatarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
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
    }
}
