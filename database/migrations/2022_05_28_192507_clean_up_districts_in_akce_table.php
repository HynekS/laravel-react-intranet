<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Akce;

class CleanUpDistrictsInAkceTable extends Migration
{
    /**
     * Backup the data.
     */
    private function backup()
    {
        $backup = Akce::select(['id_akce', 'okres'])->get();
        return $backup;
    }

    private $districts = [
        'Hl. m. Praha',

        'Benešov',
        'Beroun',
        'Kladno',
        'Kolín',
        'Kutná Hora',
        'Mělník',
        'Mladá Boleslav',
        'Nymburk',
        'Praha-východ',
        'Praha-západ',
        'Příbram',
        'Rakovník',

        'České Budějovice',
        'Český Krumlov',
        'Jindřichův Hradec',
        'Písek',
        'Prachatice',
        'Strakonice',
        'Tábor',

        'Domažlice',
        'Klatovy',
        'Plzeň-město',
        'Plzeň-jih',
        'Plzeň-sever',
        'Rokycany',
        'Tachov',

        'Cheb',
        'Karlovy Vary',
        'Sokolov',

        'Děčín',
        'Chomutov',
        'Litoměřice',
        'Louny',
        'Most',
        'Teplice',
        'Ústí nad Labem',

        'Česká Lípa',
        'Jablonec nad Nisou',
        'Liberec',
        'Semily',

        'Hradec Králové',
        'Jičín',
        'Náchod',
        'Rychnov nad Kněžnou',
        'Trutnov',

        'Chrudim',
        'Pardubice',
        'Svitavy',
        'Ústí nad Orlicí',

        'Havlíčkův Brod',
        'Jihlava',
        'Pelhřimov',
        'Třebíč',
        'Žďár nad Sázavou',

        'Blansko',
        'Brno-město',
        'Brno-venkov',
        'Břeclav',
        'Hodonín',
        'Vyškov',
        'Znojmo',

        'Jeseník',
        'Olomouc',
        'Prostějov',
        'Přerov',
        'Šumperk',

        'Kroměříž',
        'Uherské Hradiště',
        'Vsetín',
        'Zlín',

        'Bruntál',
        'Frýdek-Místek',
        'Karviná',
        'Nový Jičín',
        'Opava',
        'Ostrava-město',
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $dispatcher = Akce::getEventDispatcher();
        Akce::unsetEventDispatcher();

        \DB::raw(
            "UPDATE `akce` SET `okres` = LTRIM(RTRIM(`okres`));
             UPDATE `akce` SET `okres` = TRIM(TRAILING ',' FROM `okres`);"
        );

        $patterns = [
            '/ - /',
            '/  /',
            '/mesto/',
            '/okres /',
            '/Ždár/',
            '/Rako$/',
            '/Třěbíč/',
            '/Moravské Budějovice/',
            '/Mělník, PV/'
        ];

        $replacements = [
            '-',
            ' ',
            'město',
            '',
            'Žďár',
            'Rakovník',
            'Třebíč',
            'Třebíč',
            'Mělník'
        ];


        $akce = Akce::all();
        foreach ($akce as $row) {
            $row->okres = preg_replace($patterns, $replacements, $row->okres);
            $row->save();
        }

        Akce::setEventDispatcher($dispatcher);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // but this does not work I guess (the backup does not persist);
        /*
        Schema::table('akce', function (Blueprint $table) {
            $akce = Akce::all();
            $backup = $this->backup();
            foreach ($akce as $row) {
                $row->okres = $backup->find($row->id_akce)->okres;
                $row->save();
            }
        });*/
    }
}
