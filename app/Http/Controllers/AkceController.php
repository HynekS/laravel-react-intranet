<?php

namespace App\Http\Controllers;

use App\Akce;
use App\Http\Controllers\Controller;
use App\Http\Transformers\AkceTransformer;
use Illuminate\Http\Request;

class AkceController extends Controller
{
    public function show(Akce $akce)
    {
        $wrapper = array();
        array_push($wrapper, $akce);
        return $wrapper;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nazev_akce' => 'required|unique:akce',
        ]);

        $akce = new Akce($validated);

        $currentYear = (new \DateTime)->format("Y");
        $latestCurrentYearProject = Akce::where("rok_per_year", "=", $currentYear)->orderBy("cislo_per_year", "desc")->first();
        $yearly_id = $latestCurrentYearProject ? (int) $latestCurrentYearProject->cislo_per_year + 1 : 1;

        $akce->rok_per_year = $currentYear;
        $akce->cislo_per_year = $yearly_id;
        $akce->c_akce = $yearly_id . "/" . substr($currentYear, -2);

        $akce->save();
        return response()->json($akce, 201);
    }

    public function update(Request $request, Akce $akce)
    {
        $akce->update($request->except(['userId']));
        return response()->json($akce, 200);
    }

    public function delete(Request $request, $id)
    {
        $akce = Akce::find($id);
        $akce->delete();
        return response()->noContent();;
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

    public function search(Request $request)
    {
        $search_term = $request->search_term;

        $results = Akce::search($search_term)->get()->take(10);

        return $results;
    }
}
