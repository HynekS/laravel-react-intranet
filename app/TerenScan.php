<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TerenScan extends Model
{
    protected $guarded = ['id'];
    protected $table = 'teren_scan';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}