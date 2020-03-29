<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GeodetBod extends Model
{
    protected $guarded = ['id'];
    protected $table = 'geodet_body';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}