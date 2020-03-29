<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DigitalizaceNalez extends Model
{
    protected $guarded = ['id'];
    protected $table = 'digitalizace_nalez';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}