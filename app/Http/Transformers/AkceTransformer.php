<?php

namespace App\Http\Transformers;

class AkceTransformer
{
  public static function transformResponse($response)
  {
    is_null($response->nalez) ? $response->nalez = "null" : $response->nalez = strval($response->nalez);

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
}