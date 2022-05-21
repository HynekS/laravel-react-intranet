<?php

use Faker\Generator as Faker;
use Illuminate\Support\Str;
 
$factory->define(App\User::class, function (Faker $faker) {
    $name = $faker->unique()->name();
    return [
        'user_name' => $name,
        'full_name' => $name,
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'typ_uzivatele'=>rand(2,5),
        'created_at' => now(),
        //'hints' => 0, //?
        'active' => 1,
        //'remember_token' => Str::random(10),
    ];
});