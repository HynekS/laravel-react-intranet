<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GeodetPlan extends Model
{
    protected $guarded = ['id'];
    protected $table = 'geodet_plany';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}