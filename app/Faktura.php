<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Faktura extends Model
{
    protected $guarded = ['id_zaznam'];
    protected $table = 'faktury';
    protected $primaryKey = 'id_zaznam';
    public $timestamps = false;

    public function akce()
    {
        return $this->belongsTo('App\Akce', 'akce_id');
    }
}
