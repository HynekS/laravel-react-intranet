<?php
namespace App\Http\Controllers;

use App \ {
    Akce,
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
use Illuminate\Support\Str;
use function GuzzleHttp\json_decode;

class UploadController extends Controller
{   
    // TODO Handle differently database files (because they dont have their own tables)!!!
    public function store($data)
    {
        if (in_array($data->model, ["LAB_databaze", "teren_databaze"])) {
            $akce = Akce::find($data->id);
            $firstFilePath = $data->path . $data->filesToUpload[0]->name;
            $akce[$data->model] = $firstFilePath;
            $akce->save();

            return "Seems we have a {$data->model} which path is {$firstFilePath}";
        }

        $uploadedFiles = $data->filesToUpload;
        $model_name = Str::studly(Str::singular($data->model));
        $Model = 'App\\' . $model_name;
        $savedFiles = [];

        foreach ($uploadedFiles as $file) {
            // TODO add user id and upload datetime
            $record = new $Model();
            $record->file_path = $data->path . $file->name;
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
        $path = $data->id . "/";

        if(!Storage::exists($path)){
            Storage::makeDirectory($path);
        }
        $data->path = $path;

        foreach ($uploadedFiles as $file) {
            $base64str = explode(',', $file->content)[1];

            Storage::disk('local')->put($path . $file->name, base64_decode($base64str));
        }
        return $this->store($data);
    }
}
