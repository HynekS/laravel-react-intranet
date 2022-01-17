<?php

namespace App\Http\Transformers;

use Carbon\Carbon;

class AkceTransformer
{
  public static function transformResponse($response)
  {
    is_null($response->nalez) ? $response->nalez = "null" : $response->nalez = strval($response->nalez);
    /*
    $response->datum_pocatku_text = self::tryToParseDate($response->datum_pocatku_text);
    $response->datum_ukonceni_text = self::tryToParseDate($response->datum_ukonceni_text);
    $response->datum_pocatku = self::tryToParseDate($response->datum_pocatku);
    $response->datum_ukonceni = self::tryToParseDate($response->datum_ukonceni);
    */
    $response->LAB_databaze = $response->LAB_databaze ? [
      0 => [
        'file_path' => $response->LAB_databaze,
        'vlozeno' => $response->LAB_databaze_vlozeno,
        'vlozil' => $response->LAB_databaze_vlozil,
      ]
    ] : [];

    $response->teren_databaze = $response->teren_databaze ? [
      0 => [
        'file_path' => $response->teren_databaze,
        'vlozeno' => $response->teren_databaze_vlozeno,
        'vlozil' => $response->teren_databaze_vlozil,
      ]
    ] : [];

    unset($response['LAB_databaze_vlozeno'], $response['LAB_databaze_vlozil'], $response['teren_databaze_vlozeno'], $response['teren_databaze_vlozil']);

    return $response;
  }

  public static function transformRequest($request)
  {
  }

  private static function tryToParseDate($raw_date, $outputFormat = "j. n. Y")
  {
    try {
      return (empty($raw_date) || is_null($raw_date)) ? "" : Carbon::parse($raw_date)->format($outputFormat);
    } catch (\Exception $err) {
      return $raw_date;
    }
  }
}
