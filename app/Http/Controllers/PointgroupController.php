<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Pointgroup;

class PointgroupController extends Controller
{
    public function store(Request $request)
    {
        
        $pointgroup = new Pointgroup;
        //default
        $pointgroup->akce_id = $request->projectId;
        $pointgroup->feature_type = "line"; 
        $pointgroup->save();

        return response()->json($pointgroup, 201);

    }
    public function update(Request $request, $id)
    {
        $pointgroup = Pointgroup::with('points')->find($id);
        $pointgroup->feature_type = $request->feature_type;
        $pointgroup->save();

        return $pointgroup; // HTTP 200?
    }

    public function delete(Request $request, $id)
    {
        $pointgroup = Pointgroup::find($id);
        $pointgroup->delete();

        return $pointgroup; // HTTP 204?
    }
}
