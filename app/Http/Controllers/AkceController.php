<?php

namespace App\Http\Controllers;

use App\Akce;
use App\Http\Controllers\Controller;
use App\Http\Transformers\AkceTransformer;
use Illuminate\Http\Request;

class AkceController extends Controller
{
    public function index()
    {
        /*
        I am not using that at the moment. The memory consumption was high,
        and performance wise – it does make much more sense to request each year separately (in parallel Promise.all). 
        */
        return Akce::WithAll()->get();
        /*
        $years = [];
        $allProjectsByYear = new \stdClass;

        $distinctYears = Akce::distinct()->get(['rok_per_year']);
        foreach ($distinctYears as $key => $value) {
            $years[] = $value->rok_per_year;
        }

        foreach ($years as $year) {
            $projectsOfAYear = Akce::year($year)->WithAll()->get();
            $transformed = $projectsOfAYear->map(function ($item) {
                return AkceTransformer::transformResponse($item);
            });
            $allProjectsByYear->$year = $transformed;
        }

        return json_encode($allProjectsByYear);
        */
    }

    public function show(Akce $akce)
    {
        $wrapper = array();
        array_push($wrapper, $akce);
        return $wrapper;
    }

    public function store(AkceRequest $request)
    {
        // TODO need transform at least the 'nalez' field types
        $akce = new Akce($request->validated());
        $akce->save();
        return response()->json($akce, 201);
    }

    public function update(Request $request, Akce $akce)
    {
        $akce->update($request->all());
        return response()->json($akce, 200);
    }

    public function delete(Akce $akce)
    {
        $akce->delete();
        return response()->json(null, 204);
    }

    public function showYear($year)
    {
        $akceFromYear = Akce::year($year)->WithAll()->get();

        $keyed = collect($akceFromYear->map(function ($item) {
            return AkceTransformer::transformResponse($item);
        }))->keyBy('id_akce');
        return $keyed;
    }
    public function getByNumberOfYear($year, $num)
    {
        $akceNumOfYear = Akce::NumberOfYear($year, $num)->WithAll()->first();
        return is_null($akceNumOfYear) ? response()->json(null, 204) : AkceTransformer::transformResponse($akceNumOfYear);
    }
}
