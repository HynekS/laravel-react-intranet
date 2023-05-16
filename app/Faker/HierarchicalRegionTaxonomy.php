<?php

namespace App\Faker;

use Faker\Provider\Base;

class HierarchicalRegionTaxonomy extends Base
{
  protected static $regions = [];

  /**
   * Regions are extracted to a separate file (it's more than 70k LOC one!)
   */
  public static function get_regions()
  {
    if (self::$regions === []) {
      self::$regions = require "regions.php";
    }
    return self::$regions;
  }

  protected static function purebell($min, $max, $std_deviation, $step = 1)
    {
      $rand1 = (float)mt_rand() / (float)mt_getrandmax();
      $rand2 = (float)mt_rand() / (float)mt_getrandmax();
      $gaussian_number = sqrt(-2 * log($rand1)) * cos(2 * M_PI * $rand2);
      $mean = ($max + $min) / 2;
      $random_number = ($gaussian_number * $std_deviation) + $mean;
      $random_number = round($random_number / $step) * $step;
      if ($random_number < $min || $random_number > $max) {
        $random_number = static::purebell($min, $max, $std_deviation);
      }
      return $random_number;
    }

    protected static function biasedElement($arr, $std_deviation = null)
    {
      $index = static::purebell(0, count($arr) - 1, $std_deviation || sqrt(count($arr)));
      return $arr[$index];
    }

  public function hrt()
  {
    $random_region = static::randomElement(static::get_regions());

    $random_district = static::randomElement($random_region["districts"]);

    $random_municipality = static::randomElement($random_district["municipalities"]);

    $random_cadastral_territory = static::randomElement($random_municipality["cadastral_territories"]);

    return ["region" => $random_region["name"], "district" => $random_district["name"], "municipality" => $random_municipality["name"], "cadastral_territory" => $random_cadastral_territory["name"]];
  }

  public function hrtBiased()
  {
    $random_region = static::biasedElement(static::get_regions());

    $random_district = static::biasedElement($random_region["districts"]);

    $random_municipality = static::biasedElement($random_district["municipalities"]);

    $random_cadastral_territory = static::biasedElement($random_municipality["cadastral_territories"]);

    return ["region" => $random_region["name"], "district" => $random_district["name"], "municipality" => $random_municipality["name"], "cadastral_territory" => $random_cadastral_territory["name"]];
  }
}
