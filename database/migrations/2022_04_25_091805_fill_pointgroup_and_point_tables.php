<?php

use Illuminate\Database\Migrations\Migration;
use League\Geotools\Coordinate\Coordinate;

class FillPointgroupAndPointTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public static function tryToParse($coords)
    {
        try {
            $coordinate = new Coordinate(str_replace([';', ','], '', $coords));

            return [
                'latitude' => $coordinate->getLatitude(),
                'longitude' => $coordinate->getLongitude()
            ];
        } catch (\Exception $err) {
            return null;
        }
    }

    public static function insertPoints($points, $pointgroup_id)
    {
        foreach ($points as $point) {
            $parsed = self::tryToParse($point);
            if (is_null($parsed)) {
                DB::table('points')->insert(
                    array('pointgroup_id' => $pointgroup_id, 'coords_as_string' => $point)
                );
            } else {
                DB::table('points')->insert(
                    array('pointgroup_id' => $pointgroup_id, 'latitude' => $parsed['latitude'], 'longitude' => $parsed['longitude'])
                );
            }
        }
    }

    public function up()
    {
        $akce_with_coords = DB::table('akce')
            ->select('id_akce', 'EL_GPS_1_N', 'EL_GPS_1_E', 'EL_GPS_2_N', 'EL_GPS_2_E', 'El_forma')->get();

        foreach ($akce_with_coords as $akce) {
            $coords = array_filter([$akce->EL_GPS_1_N, $akce->EL_GPS_1_E, $akce->EL_GPS_2_N, $akce->EL_GPS_2_E]);

            if (empty($coords)) continue;

            switch (true) {
                case preg_match('/plocha mezi body/', $akce->El_forma):
                    $pointgroup_id = DB::table('pointgroups')->insertGetId(
                        array('akce_id' => $akce->id_akce, 'type' => 'polygon')
                    );
                    self::insertPoints($coords, $pointgroup_id);

                    break;
                case preg_match('/linie mezi body/', $akce->El_forma):
                    $pointgroup_id = DB::table('pointgroups')->insertGetId(
                        array('akce_id' => $akce->id_akce, 'type' => 'line')
                    );
                    self::insertPoints($coords, $pointgroup_id);

                    break;
                default: // Unclear what the coordinates do represent.
                    $pointgroup_id = DB::table('pointgroups')->insertGetId(
                        array('akce_id' => $akce->id_akce, 'type' => 'point')
                    );
                    self::insertPoints($coords, $pointgroup_id);

                    break;
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('points')->truncate();
        DB::table('pointgroups')->truncate();
        Schema::enableForeignKeyConstraints();
    }
}
