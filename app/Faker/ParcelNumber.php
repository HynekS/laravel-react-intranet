<?php

namespace App\Faker;

use Faker\Provider\Base;

class ParcelNumber extends Base
{
  public function parcelNumber(): string
  {
    $rootNumber = random_int(1, 2000);
    $partNumber = random_int(-50, 50);
    return $rootNumber . ($partNumber > 0 ? "/{$partNumber}" : "");
  }
}
