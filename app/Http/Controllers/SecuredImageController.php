<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Storage, File};

class SecuredImageController extends Controller
{
    public function show($path)
    {
        $imagePath = Storage::disk('local')->path($path);

        if (!File::exists($imagePath)) abort(404);

        $mimetype = mime_content_type($imagePath);

        if ($mimetype === "image/svg") {
            // https://github.com/laravel/framework/issues/30967
            $response =  response()->file($imagePath);
            $response->headers->set('Content-Type', 'image/svg+xml
            ');
            return $response;
        }

        return response()->file($imagePath);
    }
}
