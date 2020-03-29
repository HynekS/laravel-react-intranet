<?php
namespace App\Http\Controllers\Api;

use App \ {
    Analyza,
    DigitalizaceNalez,
    DigitalizacePlan,
    GeodetBod,
    GeodetPlan,
    TerenFoto,
    TerenScan
};
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use function GuzzleHttp\json_decode;

class UploadController extends Controller
{   
    // TODO Handle differently database files (because they dont have their own tables)!!!
    public function store($data)
    {
        $uploadedFiles = $data->filesToUpload;
        $Model = 'App\\' . studly_case(str_singular($data->model));
        $savedFiles = [];

        foreach ($uploadedFiles as $file) {
            $record = new $Model();
            $record->file_path = $file->name;
            $record->id_akce = $data->id;
            $record->save();

            $savedFiles[] = $record;
        }
        return json_encode($savedFiles);
    }

    public function upload(Request $request)
    {
        $data = json_decode($request->data);
        $uploadedFiles = $data->filesToUpload;

        foreach ($uploadedFiles as $file) {
            $base64str = explode(',', $file->content)[1];
            Storage::disk('local')->makeDirectory('foo-bar-dir');
            Storage::disk('local')->put($file->name, base64_decode($base64str));
        }
        return static::store($data);
    }
}
