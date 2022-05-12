<?php

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

    Route::post('/search', 'AkceController@search');

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

Route::group(['prefix' => 'pointgroup', 'middleware' => 'auth:api'], function () {
    Route::post('/pointgroup', 'PointgroupController@store');
    Route::put('/pointgroup/{id}', 'PointgroupController@update');
    Route::delete('/pointgroup/{id}', 'PointgroupController@delete');
});

Route::group(['prefix' => 'point', 'middleware' => 'auth:api'], function () {
    Route::post('/point', 'PointController@store');
    Route::put('/point/{id}', 'PointController@update');
    Route::delete('/point/{id}', 'PointController@delete');
});

Route::group(['prefix' => 'updates', 'middleware' => 'auth:api'], function () {
    Route::get('/latest_id', 'UpdateController@latest_id');
    Route::get('/last_month', 'UpdateController@get_last_month');
});

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/meta/users', 'MetaController@active_users');
    Route::post('/upload', 'UploadController@upload');
    Route::get('/download/{folder}/{filename?}', 'DownloadController@download');
    Route::get('/download_all/{id}', 'DownloadController@zip_and_download_all');
    Route::delete('/file', 'FileController@destroy');
    Route::post('/report/{akce}', 'ReportController@generate_pdf');
});
