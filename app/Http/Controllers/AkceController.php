<?php

namespace App\Http\Controllers;

use App\Akce;
use App\Http\Controllers\Controller;
use App\Http\Transformers\AkceTransformer;
use Illuminate\Http\Request;

class AkceController extends Controller
{
    public function store(Request $request)
    {    
        $validated = $request->validate([
            'nazev_akce' => 'required|unique:akce',
        ]);

        $akce = new Akce($request->except(['userId']));

        $akce->nazev_akce = $validated["nazev_akce"];

        $currentYear = (new \DateTime)->format("Y");
        $latestCurrentYearProject = Akce::where("rok_per_year", "=", $currentYear)->orderBy("cislo_per_year", "desc")->first();
        $yearly_id = $latestCurrentYearProject ? (int) $latestCurrentYearProject->cislo_per_year + 1 : 1;

        $akce->rok_per_year = $currentYear;
        $akce->cislo_per_year = $yearly_id;
        $akce->c_akce = $yearly_id . "/" . substr($currentYear, -2);

        $akce->save();
        $update_id = $akce->update_id;
             
        $withRelated = $akce->refresh()->withAll()->find($akce->id_akce);
        $withRelated->update_id = $update_id;

        return response()->json(AkceTransformer::transformResponse($withRelated), 201);
    }

    public function update(Request $request, Akce $akce)
    {
        // HOTFIX to prevent saving "null" as 0
        $request->merge(["nalez" => $request->stav === "null" ? null : $request->nalez]);
        $akce->update($request->except(['userId']));
        return response()->json($akce, 200);
    }

    public function delete($id)
    {
        $akce = Akce::find($id);
        $akce->delete();

        return ["update_id" => $akce->update_id];
    }

    public function showYear($year)
    {
        $akceFromYear = Akce::year($year)->WithAll()->get();

        $keyed = collect($akceFromYear->map(
            fn ($item) =>
            AkceTransformer::transformResponse($item)
        ))->keyBy('id_akce');

        return $keyed;
    }

    public function getByNumberOfYear($year, $num)
    {
        $akceNumOfYear = Akce::NumberOfYear($year, $num)
            ->WithAll()
            ->first();

        return is_null($akceNumOfYear) ? response()->json(null, 404) : AkceTransformer::transformResponse($akceNumOfYear);
    }

    public function search(Request $request)
    {
        $search_term = $request->search_term;
        $results = Akce::search($search_term)->get()->take(10);

        return $results;
    }
}
