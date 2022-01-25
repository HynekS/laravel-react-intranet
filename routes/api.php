<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');

    Route::group([
        'middleware' => 'auth:api'
    ], function () {
        Route::get('logout', 'AuthController@logout');
        Route::get('user', 'AuthController@user');
        Route::get('validate-token', function () {
            return ['data' => 'Token is valid'];
        });
    });
});

Route::group(['prefix' => 'akce', 'middleware' => 'auth:api'], function () {

    Route::get('/', 'AkceController@index');
    Route::get('/{year}', 'AkceController@showYear');
    Route::get('/{year}/{num}', 'AkceController@getByNumberOfYear');

    Route::post('/', 'AkceController@store');
    Route::put('/{akce}', 'AkceController@update');
    Route::delete('/{akce}', 'AkceController@destroy');
});

Route::group(['prefix' => 'invoices', 'middleware' => 'auth:api'], function () {

    Route::post('/', 'InvoiceController@store');
    Route::put('/{invoice}', 'InvoiceController@update');
    Route::delete('/{invoice}', 'InvoiceController@destroy');
});


Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/meta/users', 'MetaController@active_users');
    Route::post('/upload', 'UploadController@upload');
    Route::get('/download/{folder}/{filename?}', 'DownloadController@download');
    Route::delete('/file', 'FileController@destroy');
    Route::post('/report/{akce}', 'ReportController@generate_pdf');
});
