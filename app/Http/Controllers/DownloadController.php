<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function download(Request $request, $folder, $filename = null)
    {
        $path = is_null($filename) ? $folder : $folder . "/" . $filename;
        return response()->download(storage_path("app/" . $path));
    }
}
