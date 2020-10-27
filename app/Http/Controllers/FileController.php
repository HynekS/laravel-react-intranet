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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function destroy(Request $request)
    {

        if (in_array($request->model, ["LAB_databaze", "teren_databaze"])) {
            $akce = Akce::find($request->projectId);

            // We can't  be sure the file does exist in storage
            try {
                Storage::disk('local')->delete($request->model);
            } catch (Exception $e) {
            }

            $akce[$request->model] = null;
            $akce[$request->model . "_vlozil"] = null;
            $akce[$request->model . "_vlozeno"] = null;

            $akce->save();

            return ["model" => $akce[$request->model], "author" => $akce[$request->model . "_vlozil"], "created" => $akce[$request->model . "_vlozeno"]];
        }

        $model_name = Str::studly(Str::singular($request->model));
        $Model = 'App\\' . $model_name;

        $record = $Model::find($request->fileId);
        // We can't  be sure the file does exist in storage
        try {
            Storage::disk('local')->delete($record->file_path);
        } catch (Exception $e) {
        }

        $record->delete();
        return $record;
    }
}
