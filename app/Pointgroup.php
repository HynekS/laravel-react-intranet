<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pointgroup extends Model
{
    protected $guarded = ['id'];
    public $timestamps = false;

    public function akce()
    {
        return $this->belongsTo('App\Akce', 'akce_id');
    }

    public function points()
    {
        return $this->hasMany('App\Point', 'pointgroup_id');
    }
}
