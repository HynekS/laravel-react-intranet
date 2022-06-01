<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Akce extends Model
{
    use Searchable;

    protected $guarded = [];
    protected $table = 'akce';
    protected $primaryKey = 'id_akce';
    public $timestamps = false;

    /* Laravel Scout search
    WARNING:
    the engine needs this two PHP modules to be activated:
    extension=pdo_mysql
    extension=sqlite3
    */
    public function toSearchableArray()
    {
        return [
            'id_akce' => $this->id_akce,
            'c_akce' => $this->c_akce,
            'cislo_per_year' => $this->cislo_per_year,
            'rok_per_year' => $this->rok_per_year,
            'nazev_akce' => $this->nazev_akce,
            'registrace_info' => $this->registrace_info,
            'investor_jmeno' => $this->investor_jmeno,
            'katastr'=> $this->katastr,
        ];
    }

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
        // BUG | TODO: Owner_id makes much more sense (owner vs current user), but it wasn't migrated in 'akce' table,
        // which was causing bugs in FE. Would be a good idea to add implement it in one of the migrations.
        // return $this->belongsTo('App\User', 'owner_id', 'id');
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    // Dokumentace apod.
    public function pointgroups()
    {
        return $this->hasMany('App\Pointgroup', 'akce_id');
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
                'user:id,full_name',
                'pointgroups',
                'pointgroups.points',
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

    public function scopeNotCancelled($query)
    {
        return $query->where('id_stav', '>', -1);
    }
}
