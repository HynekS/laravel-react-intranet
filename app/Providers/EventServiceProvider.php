<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

use App\Akce;
use App\Observers\AkceObserver;

// Generic 'upload observer' for all uploads
use App\{
    Analyza,
    DigitalizaceNalez,
    DigitalizacePlan,
    GeodetBod,
    GeodetPlan,
    TerenFoto,
    TerenScan
};
use App\Observers\UploadObserver;

use App\Point;
use App\Observers\PointObserver;

use App\Faktura;
use App\User;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        'Laravel\Passport\Events\AccessTokenCreated' => [
            'App\Listeners\RevokeExistingTokens',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        Akce::observe(AkceObserver::class);
        
        Analyza::observe(UploadObserver::class);
        DigitalizaceNalez::observe(UploadObserver::class);
        DigitalizacePlan::observe(UploadObserver::class);
        GeodetBod::observe(UploadObserver::class);
        GeodetPlan::observe(UploadObserver::class);
        TerenFoto::observe(UploadObserver::class);
        TerenScan::observe(UploadObserver::class);

        Point::observe(PointObserver::class);
    }
}
