<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pointgroup extends Model
{
    protected $guarded = ['id'];

    public function akce() {
        return $this->belongsTo('App\Akce', 'akce_id');
    }

    public function points() {
        return $this->hasMany('App\Point', 'pointgroup_id');
    }
}
