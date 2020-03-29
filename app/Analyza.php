<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Analyza extends Model
{
    protected $guarded = ['id'];
    protected $table = 'analyzy';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    public function akce()
    {
        return $this->belongsTo('App\Akce', 'id_akce');
    }
}