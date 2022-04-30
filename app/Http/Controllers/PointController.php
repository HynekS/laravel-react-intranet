<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Point;

class PointController extends Controller
{
    public function store(Request $request)
    {
        $point = new Point;
        $point->fill($request->all());
        $point->save();

        return response()->json($point, 201);
    }
    public function update(Request $request, $id)
    {
        $point = Point::find($id);
        $point->update($request->all());
        $point->save();

        return $point;
    }

    public function delete(Request $request, $id)
    {
        $point = Point::find($id);
        $point->delete();

        return $point;
    }
}
