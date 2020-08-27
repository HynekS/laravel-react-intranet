<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Illuminate\Support\Facades\DB;

class Akce extends Model
{
    protected $guarded = [];
    protected $table = 'akce';
    protected $primaryKey = 'id_akce';
    public $timestamps = false;
    // protected $appends = ['invoice_sum'];

    /*
     * Relations to other tables
     */

    // Faktura
    public function invoice()
    {
        return $this->hasMany('App\Faktura', 'akce_id');
    }

    public function fakturyDohled()
    {
        return $this->hasMany('App\Faktura', 'akce_id')->where('typ_castky', '=', 0);
    }

    public function fakturyVyzkum()
    {
        return $this->hasMany('App\Faktura', 'akce_id')->where('typ_castky', '=', 1);
    }

    // Zajišťuje
    public function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    // Dokumentace apod.
    public function gps_point()
    {
        return $this->hasMany('App\GpsPoint', 'id_akce');
    }

    public function analyza()
    {
        return $this->hasMany('App\Analyza', 'id_akce');
    }

    public function digitalizace_nalez()
    {
        return $this->hasMany('App\DigitalizaceNalez', 'id_akce');
    }

    public function digitalizace_plan()
    {
        return $this->hasMany('App\DigitalizacePlan', 'id_akce');
    }

    public function geodet_bod()
    {
        return $this->hasMany('App\GeodetBod', 'id_akce');
    }

    public function geodet_plan()
    {
        return $this->hasMany('App\GeodetPlan', 'id_akce');
    }

    public function teren_foto()
    {
        return $this->hasMany('App\TerenFoto', 'id_akce');
    }

    public function teren_scan()
    {
        return $this->hasMany('App\TerenScan', 'id_akce');
    }

    /*
     * Scopes
     */

    public function scopeWithAll($query)
    {
        return $query->with(
            [
                'fakturyDohled',
                'fakturyVyzkum',
                'user' => function ($q) {
                    return $q->select('id', 'full_name');
                },
                //'gps_point',
                'analyza',
                'digitalizace_nalez',
                'digitalizace_plan',
                'geodet_bod',
                'geodet_plan',
                'teren_foto',
                'teren_scan'
            ]
        );
    }

    public function scopeYear($query, $year)
    {
        return $query->where('rok_per_year', '=', $year);
    }

    public function scopeNumberOfYear($query, $year, $num)
    {
        return $query->where('rok_per_year', '=', $year)->where('cislo_per_year', '=', $num);
    }
}
