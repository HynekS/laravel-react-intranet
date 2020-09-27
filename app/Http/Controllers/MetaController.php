<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class MetaController extends Controller
{
    public function active_users()
    {
        $distinctUsers = User::distinct()->where('active', '=', 1)->get(['id', 'full_name']);
        return $distinctUsers;
    }
}
