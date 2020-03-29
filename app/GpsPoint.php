<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GpsPoint extends Model
{
    protected $guarded = ['point_id'];
    protected $table = 'gps_points';
    protected $primaryKey = 'point_id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}
