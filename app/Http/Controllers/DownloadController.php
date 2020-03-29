<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function download(Request $request, $file_name){
        return response()->download(storage_path("app/" . $file_name));
    }
}
