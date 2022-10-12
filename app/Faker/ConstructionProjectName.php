<?php

namespace App\Faker;

use Faker\Provider\Base;
use Faker\Factory;

class ConstructionProjectName extends Base
{

  public function __construct()
  {
    $this->cz_faker = Factory::create("cs_CZ");
  }


  protected static function opt($value, $weight = 0.5): ?string
  {
    return rand(0, 99) > ($weight * 100) ? null : $value;
  }

  protected static function join($arr, $separator = ", ")
  {
    return implode($separator,  array_filter($arr));
  }

  protected static function ct_num(): string
  {
    $rootNumber = rand(1, 2000);
    $partNumber = rand(-50, 50);
    return $rootNumber . ($partNumber > 0 ? "/{$partNumber}" : "");
  }

  protected static function stage(): string
  {
    return (rand(1, 4)) . ". etapa";
  }

  protected static function cable_num()
  {
    return "č. " . mt_rand();
  }

  protected function construction_types()
  {
    $variants = [
      "building_type_adjectivs" => [
        "výrobní",
        "zemědělské",
        "multifunkční",
        "skladovací"
      ],
      "line_types" => [
        "NN",
        "VN",
      ],
      "work_types" => [
        "kabelová přeložka",
        "kabelová smyčka",
        "přeložka venkovní sítě",
        "přeložka vedení",
        "rekonstrukce vedení",
        "úpravy vedení"
      ],
    ];

    $pipeline = [
      "výstavba vodovodu",
      "rekonstrukce vodovodu",
      "rekonstrukce vodovodu a kanalizace",
      "prodloužení vodovodu a plynovodu",
      "prodloužení vodovodního řadu",
      "přeložka vodovodu",
      "posílení vodárenské soustavy",
      "propojení stávajících vodovodních řadů",
      "vrtaná studna na p.č. " . static::ct_num(),
      "přeložka kanalizace",
      "vodovod a kanalizace",
      "ČOV",
      "kanalizace a ČOV",
      "vodovod a vodojem",
      "odkanalizování obce",
      static::join(["stavba teplovodních rozvodů", static::opt("areál zemědělského družstva", 0.3)], " "),
      static::join(["novostavba splaškové kanalizace", static::opt("a napojení na ČOV", 0.6)], " "),
      static::join(["vodovodní a plynová přípojka, ul.", $this->cz_faker->streetName(), "č.p.", rand(1, 120), static::opt("a " . rand(1, 120), 0.5)], " "),
      "NVNK " . $this->cz_faker->streetName(),
      "inženýrské sítě " . $this->cz_faker->streetName() . ", " . static::stage(),
    ];

    $cable = [
      "výstavba nové optické telekomunikační sítě",
      "veřejné osvětlení",
      static::join([static::randomElement($variants["work_types"]),  static::randomElement($variants["line_types"])], " "),
      static::join([static::randomElement($variants["line_types"]), static::randomElement($variants["work_types"])]),
      static::join([$this->cz_faker->streetName(), "kabelový rozvod NN"]),
      static::join([$this->cz_faker->lastName(), "kabelová síť NN", static::opt(static::cable_num(), 0.4)]),
      static::join([rand(2, 6) . "xRD", "kabelové vedení", static::cable_num()]),
      static::join(["lokalita " . rand(2, 6) . "xRD", "parc. č. " . static::ct_num(), $this->cz_faker->lastName()]),
      static::join(["příp. NN", static::opt("parc. č. " . static::ct_num(), 0.5), $this->cz_faker->lastName(), static::opt(static::cable_num(), 0.5)]),
      $this->cz_faker->lastName() . ": " . "kabelová smyčka NN, " . static::cable_num(),
      static::join(["TS",  $this->cz_faker->streetName(), static::opt("kabel " . static::randomElement($variants["line_types"]))]),
      "VO v ul. " . $this->cz_faker->streetName(),
      "kabel VN, TS a NN, " . static::cable_num(),
    ];

    $residential = [
      "obytný soubor - komunikace a IS",
      "novostavba RD p." . $this->cz_faker->lastName(),
      static::join(["ZTV pro", static::opt($this->cz_faker->biasedNumberBetween(2, 10), 0.6), "RD"], " "),
      static::join(["obytný soubor " . $this->cz_faker->biasedNumberBetween(4, 20) . " RD", static::opt("technická infrastruktura", 0.3), static::opt(static::stage(), 0.2)]),
    ];

    $misc = [
      "výstavba nádrže na naftu",
      "plnící stanice CNG",
      "čerpací stanice",
      "Parkoviště P+R " . $this->cz_faker->streetName(),
      "stavba haly autoservisu",
      "výstavba zemědělské haly",
      "dostavba průmyslového areálu",
      "výstavba venkovního hřiště s umělým povrchem v areálu ZŠ",
      "Rekonstrukce a přístavba kulturního domu",
      "dopravní a technická infrastruktura",
      "rekonstrukce chodnků",
      "rekonstrukce komunikace",
      "osvětlení příjezdové cesty",
      "výstavba inženýrských sítí a komunikace",
      "ubytovací zařízení",
      "areál hromadné rekreace",
      "stavba hasičské zbrojnice",
      "oprava železničníhho mostu",
      "revitalizace potoka",
      "výstavba opěrné zdi",
      "výstavba komunikací a IS pro průmyslovou zónu",
      "oprava požární nádrže parc. č. " . static::ct_num() . " a " . static::ct_num(),
      "Revitalizace rybníka, parc. č. " . static::ct_num(),
      "Rozšíření skladu surovin, areál firmy " . $this->cz_faker->company(),
      "prodejna potravin",
      static::join(["chodník v ulici", $this->cz_faker->streetName()], " "),
      static::join([static::opt("multifunkční", 0.5), "sportovní hala", static::opt("a sportovní areál", 0.5)], " "),
      static::join([$this->cz_faker->optional()->streetName(), "přístavba " . static::opt(static::randomElement($variants["building_type_adjectivs"]), 0.2) . "haly"]),
      "rekonstrukce polní cesty C" . rand(1, 5),
      (function () {
        $n1 = $this->cz_faker->biasedNumberBetween(1, 25);
        $n2 = $n1 + 1;
        $abbr = static::opt(rand(0, 1) ? "H" : "V") . "C";
        return static::join(["polní cesta {$abbr}{$n1}", static::opt("a {$abbr}{$n2}", 0.5)], " ");
      })()
    ];

    return array_merge($pipeline, $cable, $residential, $misc);
  }

  public function constructionProject()
  {
    return static::randomElement(static::construction_types());
  }
}
