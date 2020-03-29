<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TerenFoto extends Model
{
    protected $guarded = ['id'];
    protected $table = 'teren_foto';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}