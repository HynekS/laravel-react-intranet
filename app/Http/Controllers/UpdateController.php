<?php

namespace App\Http\Controllers;

use App\Update;
use Carbon\Carbon;

class UpdateController extends Controller
{
    public function latest_id()
    {
        $latest_id = Update::latest('id')->limit(1)->value('id');
        return $latest_id;
    }

    public function get_last_month()
    {
        $projects_updated_last_month_with_updates = Update::where('created_at', '>=', Carbon::now()->subDays(30)->toDateTimeString())
            ->orderBy('created_at', 'DESC')
            ->select('id','akce_id')
            ->with('akce:id_akce,cislo_per_year,rok_per_year,nazev_akce')     
            ->get()
            ->unique('akce_id')
            ->map(fn ($result) => collect($result)
                ->put('updates', Update::where('created_at', '>=', Carbon::now()->subDays(30)->toDateTimeString())
                    ->where('akce_id', '=', $result->akce_id)
                    ->orderBy('created_at', 'DESC')
                    ->with('user:id,full_name,avatar_path')
                    ->get()->unique('update_scope')
                    ->values()
                    ->toArray()))
            ->values();
        
        return  $projects_updated_last_month_with_updates;
    }
}
