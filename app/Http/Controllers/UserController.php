<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
    public function active_users()
    {
        $active_users = User::where('active', '=', 1)->get(['id', 'full_name']);
        return $active_users;
    }
}
