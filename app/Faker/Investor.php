<?php

namespace App\Faker;

use Faker\Provider\Base;
use Faker\Factory;

class Investor extends Base
{
  public function __construct()
  {
    $this->cz_faker = Factory::create("cs_CZ");
  }

  static $customNamePool = [
    "Chain Energy",
    "Energy Match",
    "Contact Energy",
    "Bravo Energy",
    "Legion Energy",
    "Energy Internet",
    "Maximo Energy",
    "Energy Ware",
    "Zone Energy",
    "Entity",
    "Paradox Energy",
    "Radiant Energy",
    "Box Energy",
    "ThinkTank Energy",
    "Traffic Energy",
    "Energy Pod",
    "Deep Energy",
    "Genesis Energy",
    "Energy Sys",
    "Aerial Energy",
    "Blast Energy",
    "BlackHole Energy",
    "Energy Peek",
    "Aqua Noble",
    "Initial Aqua",
    "Proximity Aqua",
    "Aqua Sense",
    "Aqua Top",
    "Aqua Stores",
    "Arbor Aqua",
    "Aqua Market",
    "Ample Aqua",
    "Aqua Rise",
    "Variety Aqua",
    "Regent Aqua",
    "Verve Aqua",
    "Systems Aqua",
    "Aqua Ring",
    "Tri Aqua",
    "Quality Sanitation",
    "State Sanitation",
    "Sanitation Collective",
    "Tempo Sanitation",
    "Fluid Sanitation",
    "Perfect Sanitation",
    "Synergy Sanitation"
  ];

  protected static function opt($value, $weight = 0.5): ?string
  {
    return rand(0, 99) > ($weight * 100) ? null : $value;
  }

  protected static function join($arr, $separator = ", ")
  {
    return implode($separator,  array_filter($arr));
  }

  protected static function suffix(): ?string {
    $cast = rand(0, 99);
    return $cast < 33 ? null : ($cast < 66 ? "s.r.o" : "a.s.");
  }

  protected function getcompleteNames()
  {
    $customNames = array_map(function ($investor) {
      $seed = rand(0, 10);
      $variableSeparator = $seed < 7 ? " " : (($seed < 9) ? "-" : "");
      return static::join([str_replace(" ", $variableSeparator, $investor), static::suffix()], ", ");
    }, static::$customNamePool);

    $abbreviationNames = array_map(function () {
      return static::join([substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 10, rand(3, 4)), static::suffix()], ", ");
    }, range(1, 8));

    $defaultFakerNames = array_map(function () {
      return $this->cz_faker->company();
    }, range(0, 10));

    return array_merge($customNames, $abbreviationNames, $defaultFakerNames);
  }

  public function investor()
  {
    return static::randomElement(static::getcompleteNames());
  }
}
