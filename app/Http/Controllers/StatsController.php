<?php

namespace App\Http\Controllers;

use App\Akce;

class StatsController extends Controller
{
    public function getStatsByDistricts()
    {
        $not_cancelled = Akce::notCancelled()->get();

        $districts = Akce::select('okres')
            ->distinct('okres')
            ->get()
            ->toArray();

        $all_by_districts = collect($districts)
            ->map(fn ($d) => [$d['okres'] =>
            [
                'all' => $not_cancelled->where('okres', '=', $d['okres'])->count(),
                'negative' => $not_cancelled->where('okres', '=', $d['okres'])->where('nalez', '=', 0)->count(),
                'positive' => $not_cancelled->where('okres', '=', $d['okres'])->where('nalez', '=', 1)->count(),
                '1' => $not_cancelled->where('okres', '=', $d['okres'])->where('id_stav', '=', 1)->count(),
                '2' => $not_cancelled->where('okres', '=', $d['okres'])->where('id_stav', '=', 2)->count(),
                '3' => $not_cancelled->where('okres', '=', $d['okres'])->where('id_stav', '=', 3)->count(),
                '4' => $not_cancelled->where('okres', '=', $d['okres'])->where('id_stav', '=', 4)->count(),
            ]])
            ->toArray();

        return response()->json($all_by_districts, 200);
    }


    public function getStatsByYears()
    {

        $years = Akce::select('rok_per_year')->distinct()->get()->keyBy('rok_per_year')->keys();

        $all_by_years = $years
            ->mapWithKeys(function ($y) {
                $not_cancelled = Akce::notCancelled()->where('rok_per_year', '=', $y)->get();

                return [$y => [

                    'all' => $not_cancelled->where('rok_per_year', '=', $y)->count(),
                    'negative' => $not_cancelled->where('nalez', '=', 0)->count(),
                    'positive' => $not_cancelled->where('nalez', '=', 1)->count(),
                    '1' => $not_cancelled->where('id_stav', '=', 1)->count(),
                    '2' => $not_cancelled->where('id_stav', '=', 2)->count(),
                    '3' => $not_cancelled->where('id_stav', '=', 3)->count(),
                    '4' => $not_cancelled->where('id_stav', '=', 4)->count(),
                ]];
            });
        return response()->json($all_by_years, 200);
    }

    
    public function getCurrentStateSummary()
    {
        $not_cancelled = Akce::notCancelled()->get();

        $summary =  [
            '1' => $not_cancelled->where('id_stav', '=', 1)->count(),
            '2' => $not_cancelled->where('id_stav', '=', 2)->count(),
            '3' => $not_cancelled->where('id_stav', '=', 3)->count(),
            '4' => $not_cancelled->where('id_stav', '=', 4)->count(),
        ];

        return response()->json($summary, 200);
    }


    public function getStatsByYearsAndDistricts()
    {
        $by_years = Akce::select(['id_akce', 'rok_per_year', 'okres', 'nalez', 'id_stav'])
            ->notCancelled()
            ->get()
            ->groupBy('rok_per_year')
            ->map(fn ($y) => collect($y)->groupBy('okres')->toArray());

        $all_by_years = collect($by_years)
            ->map(fn ($y) => collect($y)
                ->map(fn ($yd) =>
                [
                    'all' => count($yd),
                    'negative' => count(array_filter($yd, fn ($a) => $a['nalez'] === 0)),
                    'positive' => count(array_filter($yd, fn ($a) => $a['nalez'] === 1)),
                    '1' => count(array_filter($yd, fn ($a) => $a['id_stav'] === 1)),
                    '2' => count(array_filter($yd, fn ($a) => $a['id_stav'] === 2)),
                    '3' => count(array_filter($yd, fn ($a) => $a['id_stav'] === 3)),
                    '4' => count(array_filter($yd, fn ($a) => $a['id_stav'] === 4))
                ])
                ->toArray());

        return response()->json($all_by_years, 200);
    }
}
