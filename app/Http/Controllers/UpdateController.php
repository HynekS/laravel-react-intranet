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

    public function get_last_month() {
        $from_last_month =  Update::where('created_at', '>=', Carbon::now()->subDays(30)->toDateTimeString())->get();
        return $from_last_month;
    }
}
