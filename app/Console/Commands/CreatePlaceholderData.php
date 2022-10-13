<?php

namespace App\Console\Commands;

use App\User;
use App\Akce;
use Faker\Generator as Faker;
use Illuminate\Console\Command;
use DateTime, DateTimeImmutable, DateInterval;

class CreatePlaceholderData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fakedatabase';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate database with placeholder data';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $faker = app(Faker::class);

        $dispatcher = Akce::getEventDispatcher();
        // Remove Dispatcher 
        Akce::unsetEventDispatcher();

        function purebell($min, $max, $std_deviation, $step = 1)
        {
            $rand1 = (float)mt_rand() / (float)mt_getrandmax();
            $rand2 = (float)mt_rand() / (float)mt_getrandmax();
            $gaussian_number = sqrt(-2 * log($rand1)) * cos(2 * M_PI * $rand2);
            $mean = ($max + $min) / 2;
            $random_number = ($gaussian_number * $std_deviation) + $mean;
            $random_number = round($random_number / $step) * $step;
            if ($random_number < $min || $random_number > $max) {
                $random_number = purebell($min, $max, $std_deviation);
            }
            return $random_number;
        }

        // Wipe the DB – or override env and create a new one?
        function getYearsSince($since): array
        {
            $currentYear = date("Y");
            $diff = $currentYear - $since;

            $temp = array_fill(0, $diff, $since);
            return array_map(fn ($item, $i) => $item + $i, array_keys($temp), array_values($temp));
        }

        function biasedElement($arr, $std_deviation = null) {
            $index = purebell(0, count($arr) - 1, $std_deviation || sqrt(count($arr)));
            return $arr[$index];
        }



        $yearsSince2013 = getYearsSince(2013);

        // Generate users pool
        $userPool = factory(User::class, 15)->make();
        
        // Generate investors pool
        $investorsPool = array_map(fn() => $faker->investor(), range(0, 100));
        // print_r($investorsPool);
        
        $akcePool = factory(Akce::class, 50)->make();

        foreach($akcePool as $akce) {
            $prominence = ceil(rand(1, 12) / rand(1, 12));

            $akce->investor_jmeno = biasedElement($investorsPool);

            $akce->user_id = User::inRandomOrder()->first()->id;

            $currentYear = (new \DateTime)->format("Y");
            $latestCurrentYearProject = Akce::where("rok_per_year", "=", $currentYear)->orderBy("cislo_per_year", "desc")->first();
            $yearly_id = $latestCurrentYearProject ? (int) $latestCurrentYearProject->cislo_per_year + 1 : 1;
    
            $akce->rok_per_year = $currentYear;
            $akce->cislo_per_year = $yearly_id;
            $akce->c_akce = $yearly_id . "/" . substr($currentYear, -2);

            $baseDate = new DateTimeImmutable("1-1-2022");
            $addedDays = floor((count($akcePool)) / 365 * $yearly_id);
            $dateCreated = $baseDate->add(new DateInterval("P{$addedDays}D"));
            $akce->datum_vytvoreni = date($dateCreated->format('Y-m-d H:i:s'));

            $dateOfStart = $dateCreated->add(new DateInterval("P" . purebell(1, 240, 120) . "D"));
            $dateOfEnd = $dateOfStart->add(new DateInterval("P" . pow($prominence, 2)  . "D"));

            $akce->datum_pocatku = $dateOfStart < new DateTime() ? $dateOfStart : null;
            $akce->datum_ukonceni = $dateOfEnd < new DateTime() ? $dateOfEnd : null;
            
            // RANDOMIZE!
            $akce->nalez = ($akce->datum_ukonceni) ? (int) purebell(1, 100, 50) < 20 : null;
            $akce->id_stav = 0;

            $akce->create($akce->getAttributes());
            
        }

        Akce::setEventDispatcher($dispatcher);

        // Create array of years
        // For every year create number of projects
        // Assign 

        return 0;
    }
}
