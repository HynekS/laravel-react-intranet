<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use File;

class DownloadController extends Controller
{
    public function download(Request $request, $folder, $filename = null)
    {
        $path = is_null($filename) ? $folder : $folder . "/" . $filename;
        return response()->download(storage_path("app/" . $path));
    }

    public function zip_and_download_all(Request $request, $id)
    {
        $zip = new \ZipArchive();
        $fileName = "soubory_k_akci_id_{$id}.zip";

        if (!file_exists(public_path($fileName))) {
            touch(public_path($fileName), strtotime('-1 days'));
        }

        if ($zip->open(public_path($fileName), \ZipArchive::CREATE) == TRUE && File::isDirectory(storage_path("app/" . $id . "/"))) {
            $files = File::allFiles(storage_path("app/" . $id . "/"));
            foreach ($files as $_ => $value) {
                $relativeName = basename($value);
                $zip->addFile($value, $relativeName);
            }
            $zip->close();
        }
        return response()->download(public_path($fileName))->deleteFileAfterSend(true);
    }
}
