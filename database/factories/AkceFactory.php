<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Akce;
use Faker\Generator as Faker;

$factory->define(Akce::class, function (Faker $faker) {
    $prependedMunicipalityFormat = '%1$s, %2$s';
    $appendedMunicipalityFormat = '%2$s, %1$s';
    $specialAppendedMunicipalityFormat = '%2$s v obci %1$s';
    $noMunicipalityFormat = '%2$s';

    $chance = mt_rand(1, 100);
    $format = ($chance <= 55
        ? $prependedMunicipalityFormat
        : ($chance <= 70
            ? $appendedMunicipalityFormat  : ($chance <= 85 ? $specialAppendedMunicipalityFormat : $noMunicipalityFormat)));

    // $territory = $faker->hrt();
    $territory = $faker->hrtBiased();

    // 2–10%
    //$isPositive = mt_rand()

    return [
        "nazev_akce" => ucfirst(sprintf($format, $territory["municipality"], $faker->constructionProject())),
        "kraj" => $territory["region"],
        "okres" => $territory["district"],
        "katastr" => $territory["cadastral_territory"],
        "investor_jmeno" => $faker->company(),
    ];
});
