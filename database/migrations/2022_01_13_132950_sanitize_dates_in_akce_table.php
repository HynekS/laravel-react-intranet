<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class SanitizeDatesInAkceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    // TODO used in a similar manner in a transformer; maybe it would deserve its own class.
    public static function tryToParse($date)
    {
        try {
            return Carbon::createFromFormat("j. n. Y", trim($date))->format('Y-m-d');
        } catch (\Exception $err) {
            return null;
        }
    }

    public function up()
    {
        $modifiers = ['pocatku', 'ukonceni'];

        foreach ($modifiers as $modifier) {
            $results = DB::table('akce')->select('id_akce', "datum_{$modifier}", "datum_{$modifier}_text")->get();

            foreach ($results as $result) {

                if (empty(trim($result->{"datum_{$modifier}"}))) {
                    DB::table('akce')
                        ->where('id_akce', $result->id_akce)
                        ->update([
                            "datum_{$modifier}" => null,
                        ]);
                    continue;
                } elseif (is_string($result->{"datum_{$modifier}"})) {
                    $attempt = self::tryToParse($result->{"datum_{$modifier}"});

                    $output = new Symfony\Component\Console\Output\ConsoleOutput();
                    $output->writeln("Modifier: " . "{$modifier}" . "Datum: " . $result->{"datum_{$modifier}"} . "Carbon: " . $attempt);

                    if ($attempt) {
                        DB::table('akce')
                            ->where('id_akce', $result->id_akce)
                            ->update([
                                "datum_{$modifier}" => $attempt,
                            ]);
                    } else {
                        // We wasn't able to parse the date and the 'loose date' is empty.
                        // We will append the date into the 'loose date' column.

                        DB::table('akce')
                            ->where('id_akce', $result->id_akce)
                            ->update([
                                "datum_{$modifier}_text" => $result->{"datum_{$modifier}"} . "; " . $result->{"datum_{$modifier}"},
                                "datum_{$modifier}" => null
                            ]);
                    }
                }
            }
            Schema::table('akce', function (Blueprint $table) use ($modifier) {
                $table->date("datum_{$modifier}")->nullable()->default(null)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
