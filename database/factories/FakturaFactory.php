<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Faktura;
use Faker\Generator as Faker;

$factory->define(Faktura::class, function (Faker $faker, $params) {
    return [
        "castka" => $params["castka"] ?? 1500, // ($baseAmount * $randomizedProminence),
        "datum_vlozeni" => now(),
        "akce_id" => $params["akce_id"],
    ];
});
