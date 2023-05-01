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
use Illuminate\Support\Facades\{Storage, File};
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Image;
use function GuzzleHttp\json_decode;

class UploadController extends Controller
{
    public $allowed_mimetypes_for_thumbnails = ['image/jpeg', 'image/gif', 'image/png', 'image/webp'];

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
        // for Observers. Request is not decoded for singular models when it hit them, which is causing error.
        $request->merge(["userId" => $data->userId]);

        $file = $data->file;
        $directory = $data->projectId . "/";
        $data->path = $directory;

        $base64str = explode(',', $file->content)[1];
        $mimetype = mime_content_type($file->content);

        File::ensureDirectoryExists($directory);

        $storage = Storage::disk('local');

        if (in_array($data->model, ["LAB_databaze", "teren_databaze"])) {

            $akce = Akce::find($data->projectId);
            // The DBs are part or an Akce row and therefore can store only one record.
            // It is thus neccessary to remove an old file to prevent orphaned files in storage.
            if ($akce[$data->model] && Storage::disk('local')->exists($akce[$data->model])) {
                $storage->delete($akce[$data->model]);
            }

            $storage->put($directory . $file->name, base64_decode($base64str));
        } else {

            $uniqueFileName = $this->createUniqueFileName($directory, $file->name);
            $data->file->name = $uniqueFileName;

            $storage->put($directory . $uniqueFileName, base64_decode($base64str));

            if (in_array($mimetype, $this->allowed_mimetypes_for_thumbnails)) {
                try {
                    File::ensureDirectoryExists($storage->path($directory . "/thumbnails"));
                    $thumbnail = $this->createThumbnail($storage->path($directory . $uniqueFileName), 200, 200);
                    Storage::disk('local')->put($directory . "/thumbnails\/" . "thumbnail_" . $uniqueFileName, $thumbnail->encode($thumbnail->extension));
                } catch (\Throwable $th) {
                    // Just swallow the error for now;
                }
            }
        }
        return $this->store($data);
    }

    public function createUniqueFileName($directory, $filename)
    {
        $storage = Storage::disk('local');

        if ($storage->exists($directory . $filename)) {
            $name = pathinfo($filename, PATHINFO_FILENAME);
            $extension = pathinfo($filename, PATHINFO_EXTENSION);

            $duplicateCounter = 1;

            while ($storage->exists($directory . $name . "(" . $duplicateCounter . ")." . $extension)) {
                $duplicateCounter++;
            }

            return $name . "(" . $duplicateCounter . ")." . $extension;
        }
        return $filename;
    }

    public function createThumbnail($path, $width, $height)
    {
        $img = Image::make($path)->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
        });
        return $img;
    }
}
