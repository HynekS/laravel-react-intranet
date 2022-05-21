<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update($request);

        return response()->json([
            'user' => $user
        ], 201);
    }
}
