<?php

namespace App\Console\Commands;

use App\User;
use App\Akce;
use App\Faktura;
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

        function join($arr, $separator = ", ")
        {
            return implode($separator,  array_filter($arr));
        }

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

            $temp = array_fill(0, $diff + 1, $since);
            return array_map(fn ($item, $i) => $item + $i, array_keys($temp), array_values($temp));
        }

        function biasedElement($arr, $std_deviation = null)
        {
            $index = purebell(0, count($arr) - 1, $std_deviation || sqrt(count($arr)));
            return $arr[$index];
        }

        $yearsSince2014 = getYearsSince(2014);

        // Generate investors pool
        $investorsPool = array_map(fn () => $faker->investor(), range(0, 100));
        print_r($investorsPool);

        $selectedYear = $this->choice(
            'What year we are going to handle?',
            $yearsSince2014,
            array_key_last($yearsSince2014)
        );

        $selectedAmount = $this->choice(
            'How many mock projects are we going to create?',
            [10, 50, 100, 200, 500],
            2
        );

        $akcePool = factory(Akce::class, $selectedAmount)->make();

        $incrementingInvoiceNumber = 0;

        foreach ($akcePool as $akce) {
            $baseAmount = 1500;
            $prominence = ceil(rand(1, 12) / rand(1, 12));
            $randomizer = purebell(5, 15, 5) / 10;
            $randomizedProminence =  $prominence * $randomizer;

            // Can be blank if project was cancelled or hasn't start yet!
            $investor = biasedElement($investorsPool);
            $contact = $faker->randomElement($investor["contacts"]);
            $akce->investor_jmeno = $investor["companyName"];
            $akce->investor_kontakt = join([$contact['name'], $contact['phone'], $contact['email']], " ");
            $akce->investor_adresa = $investor["address"];
            $akce->investor_ico = $investor["ico"];

            $akce->user_id = User::inRandomOrder()->first()->id;

            $currentYear = $selectedYear;
            $latestCurrentYearProject = Akce::where("rok_per_year", "=", $currentYear)->orderBy("cislo_per_year", "desc")->first();
            $yearly_id = $latestCurrentYearProject ? (int) $latestCurrentYearProject->cislo_per_year + 1 : 1;
            $compositeProjectNumber = $yearly_id . "/" . substr($currentYear, -2);


            $akce->rok_per_year = $currentYear;
            $akce->cislo_per_year = $yearly_id;
            $akce->c_akce = $compositeProjectNumber;


            $baseDate = new DateTimeImmutable("1-1-{$selectedYear}");
            $addedDays = floor((count($akcePool)) / 365 * $yearly_id);
            $dateCreated = $baseDate->add(new DateInterval("P{$addedDays}D"));
            $akce->datum_vytvoreni = date($dateCreated->format('Y-m-d H:i:s'));


            $dateOfStart = $dateCreated->add(new DateInterval("P" . purebell(1, 365, 182) . "D"));
            $dateOfEnd = new \DateTimeImmutable($dateOfStart->format("Y-m-d"));
            $dateOfEnd = $dateOfEnd->add(new DateInterval("P" . pow(ceil($randomizedProminence), 4)  . "D"));


            // TODO project can have a date of start even before it begins (a textual one)…
            $isProjectCommenced = ($dateOfStart < new DateTime());
            $isProjectConcluded = ($dateOfEnd < new DateTime());

            $akce->datum_pocatku = $isProjectCommenced ? $dateOfStart : null;
            $akce->datum_ukonceni = $isProjectConcluded ? $dateOfEnd : null;

            // RANDOMIZE!
            $findingState = ($akce->datum_ukonceni) ? (int) purebell(1, 100, 50) < 20 : 2;
            $activityState = $isProjectCommenced ? ($isProjectConcluded ? (($findingState === 1) ? (rand(0, 1) ? 3 : 4) : 4) : 2) : 1;
            $akce->nalez = $findingState;
            $akce->id_stav = $activityState;

            // TODO For god's sake, rename those columns!
            // vyzkum
            $akce->rozpocet_A =  $findingState ? ($baseAmount * $randomizedProminence * 4) * $prominence : null;
            // dohled
            $akce->rozpocet_B = ($baseAmount * $randomizedProminence * $prominence) + ($baseAmount * $randomizedProminence);

            if ((rand(1, 10) + $activityState) > 7) {
                $akce->registrovano_bit = 1;
                $is_in_moravia = in_array($akce->kraj, ["Moravskoslezský", "Jihomoravský", "Olomoucký", "Zlínský"]) || (in_array($akce->kraj, ["Vysočina", "Pardubický"]) && in_array($akce->okres, ["Svitavy", "Žďár nad Sázavou", "Třebíč", "Jihlava"]));
                $akce->registrace_info = ($is_in_moravia ? "M-" : "C-") . $dateOfEnd->format("Y") . rand(10000, 99999);
                
                if($activityState === 4 && rand(1, 10) > 5) {
                    $akce->zaa_hlaseno = 1;
                }
            }

            if (rand(1, 10) > 2) {
                $akce->objednavka = 1;

                if (rand(1, 10) > 5) {
                    $akce->objednavka_cislo = rand(100, 500);
                }
            }

            if (rand(1, 10) > 2) {
                $akce->smlouva = 1;
            }

            $akce->save();
            $projectId = $akce->id_akce;

            // Create invoices
            if ($activityState > 2) {

                // Invoices dor "dohled"
                $invoices_surveillance = factory(Faktura::class, (int) $prominence - rand(0, $prominence))
                    ->make(["castka" => ($baseAmount * $randomizedProminence), "akce_id" => $projectId]);

                foreach ($invoices_surveillance as $invoice) {
                    $incrementingInvoiceNumber += 1;
                    $invoice->c_faktury = $incrementingInvoiceNumber;
                    $invoice->typ_castky = 0; // dohled
                    $invoice->save();
                }

                // Invoices for "vyzkum"
                if ($findingState) {
                    $invoices_research = factory(Faktura::class, (int) $prominence - rand(0, $prominence))
                        ->make(["castka" => ($baseAmount * $randomizedProminence * $prominence), "akce_id" => $projectId]);

                    foreach ($invoices_research as $invoice) {
                        $incrementingInvoiceNumber += 1;
                        $invoice->c_faktury = $incrementingInvoiceNumber;
                        $invoice->typ_castky = 1; // vyzkum
                        $invoice->save();
                    }
                }
            }
        }

        Akce::setEventDispatcher($dispatcher);

        return 0;
    }
}
