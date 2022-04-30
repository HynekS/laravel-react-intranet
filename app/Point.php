<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    protected $guarded = ['id'];
    public $timestamps = false;
    
    public function pointgroups() {
        return $this->belongsTo('App\Pointgroup', 'pointgroup_id');
    }
}
