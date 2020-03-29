<?php

namespace App\Http\Controllers;

use App\Akce;
use App\Http\Controllers\Controller;
use App\Http\Requests\AkceRequest;
use Illuminate\Http\Request;

class AkceController extends Controller
{
    public function index()
    {
        //return Akce::WithAll()->get();

        $years = [];
        $allProjectsByYear = new \stdClass;

        // This overhead is because I don't know how to remove 'appends' property in one query
        $distinctYears = Akce::distinct()->get(['rok_per_year']);
        foreach ($distinctYears as $key => $value) {
            $years[] = $value->rok_per_year;
        }

        foreach ($years as $year) {
            $allProjectsByYear->$year = Akce::year($year)->get();
        }

        return json_encode($allProjectsByYear);

        // Might be useful, but gives an object instead of array ('cause JSON can't use associative arrays)
        //$result = Akce::all()->keyBy('id_akce');
        //return $result;
    }

    public function show(Akce $akce)
    {
        $wrapper = array();
        array_push($wrapper, $akce);
        return $wrapper;
    }

    public function store(AkceRequest $request)
    {
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
        $akceFromYear = Akce::year($year)->get();
        return $akceFromYear;
    }
    public function getByNumberOfYear($year, $num)
    {
        $akceNumOfYear = Akce::NumberOfYear($year, $num)->WithAll()->first();
        return is_null($akceNumOfYear) ? response()->json(null, 204) : $akceNumOfYear;
    }
}
