<?php

use App\User;
use Faker\Generator as Faker;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

$factory->define(User::class, function (Faker $faker) {
    $gender = mt_rand(0, 1) ? "female" : "male";
    $first_name = $faker->firstName($gender);
    $lastName = $faker->lastName($gender);

    return [
        'user_name' => transliterator_transliterate('Any-Latin; Latin-ASCII;', $first_name),
        'full_name' => "{$first_name} {$lastName}",
        'password' => Hash::make(Str::random(8, 16)),
        'typ_uzivatele' => rand(2, 5),
        'created_at' => now(),
        'active' => 1,
    ];
});
