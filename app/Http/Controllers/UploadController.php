<?php

namespace App\Http\Controllers;

use App\{
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
use Carbon\Carbon;
use function GuzzleHttp\json_decode;

class UploadController extends Controller
{
    public function store($data)
    {
        if (in_array($data->model, ["LAB_databaze", "teren_databaze"])) {
            $akce = Akce::find($data->projectId);
            $firstFilePath = $data->path . $data->file->name;
            $akce[$data->model] = $firstFilePath;
            $akce[$data->model . "_vlozil"] = $data->userId;
            $akce[$data->model . "_vlozeno"] = Carbon::now();
            $akce->save();

            return ["model" => $data->model, "file" => [
                "file_path" => $firstFilePath,
                "vlozil" => $data->userId,
                "vlozeno" => $akce[$data->model . "_vlozeno"],
            ]];
        }

        $file = $data->file;
        $model_name = Str::studly(Str::singular($data->model));
        $Model = 'App\\' . $model_name;

        $record = new $Model();
        $record->file_path = $data->path . $file->name;
        $record->id_akce = $data->projectId;
        $record->vlozil = $data->userId;
        $record->vlozeno = Carbon::now();
        $record->save();

        return ["model" => $data->model, "file" => $record];
    }

    public function upload(Request $request)
    {
        $data = json_decode($request->data);
        $file = $data->file;
        $directory = $data->projectId . "/";

        if (!Storage::exists($directory)) {
            Storage::makeDirectory($directory);
        }
        $data->path = $directory;
        $base64str = explode(',', $file->content)[1];

        if (in_array($data->model, ["LAB_databaze", "teren_databaze"])) {

            $akce = Akce::find($data->projectId);
            // The DBs are part or an Akce row and therefore can store only one record.
            // It is thus neccessary to remove an old file to prevent orphaned files in storage.
            if ($akce[$data->model] && Storage::disk('local')->exists($akce[$data->model])) {
                Storage::disk('local')->delete($akce[$data->model]);
            }

            Storage::disk('local')->put($directory . $file->name, base64_decode($base64str));
        } else {

            $uniqueFileName = $this->createUniqueFileName($directory, $file->name);
            $data->file->name = $uniqueFileName;

            Storage::disk('local')->put($directory . $uniqueFileName, base64_decode($base64str));
        }
        return $this->store($data);
    }

    public function createUniqueFileName($directory, $filename)
    {

        if (Storage::disk('local')->exists($directory . $filename)) {
            $name = pathinfo($filename, PATHINFO_FILENAME);
            $extension = pathinfo($filename, PATHINFO_EXTENSION);

            $duplicateCounter = 1;

            while (Storage::disk('local')->exists($directory . $name . "(" . $duplicateCounter . ")." . $extension)) {
                $duplicateCounter++;
            }

            return $name . "(" . $duplicateCounter . ")." . $extension;
        }
        return $filename;
    }
}
