<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Update extends Model
{
    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function akce()
    {
        return $this->belongsTo('App\Akce', 'akce_id', 'id_akce');
    }
}
