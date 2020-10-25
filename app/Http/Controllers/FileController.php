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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function destroy(Request $request)
    {
        if (in_array($request->model, ["LAB_databaze", "teren_databaze"])) {
            $akce = Akce::find($request->projectId);
            
            Storage::delete($akce[$request->model]);
            $akce[$request->model] = null;
            $akce[$request->model . "_vlozil"] = null;
            $akce[$request->model . "_vlozeno"] = null;

            return "test response";
        }

        $model_name = Str::studly(Str::singular($request->model));
        $Model = 'App\\' . $model_name;

        $record = $Model::find($request->fileId);
        Storage::delete($record->file_path);

        $record->delete();
        return $record;
    }
}
