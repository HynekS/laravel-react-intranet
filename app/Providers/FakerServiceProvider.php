<?php

namespace App\Providers;

use App\Faker\{ParcelNumber, HierarchicalRegionTaxonomy, ConstructionProjectName, Investor};
use Faker\{Factory, Generator};
use Illuminate\Support\ServiceProvider;

class FakerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Generator::class, function () {
            $faker = Factory::create(env("FAKER_LOCALE"));
            $faker->addProvider(new ParcelNumber($faker));
            $faker->addProvider(new HierarchicalRegionTaxonomy($faker));
            $faker->addProvider(new ConstructionProjectName($faker));
            $faker->addProvider(new Investor($faker));

            return $faker;
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
