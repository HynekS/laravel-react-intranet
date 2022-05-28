<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
  /**
   * Create user
   *
   * @param  [string] name
   * @param  [string] email
   * @param  [string] password
   * @param  [string] password_confirmation
   * @return [string] message
   */
  public function signup(Request $request)
  {
    $request->validate([
      'full_name' => 'required|string|unique:users',
      'user_name' => 'required|string|unique:users',
      'email' => 'required|string|email|unique:users',
      'password' => 'required|string|confirmed'
    ]);
    $user = new User([
      'full_name' => $request->full_name,
      'user_name' => $request->user_name,
      'email' => $request->email,
      'password' => Hash::make($request->password)
    ]);
    $user->save();
    return response()->json([
      'message' => 'Successfully created user!'
    ], 201);
  }

  /**
   * Login user and create token
   *
   * @param  [string] user_name
   * @param  [string] password
   * @return [string] access_token
   * @return [string] token_type
   * @return [string] expires_in
   */
  public function login(Request $request)
  {
    $request->validate([
      'user_name' => 'required|string',
      'password' => 'required|string',
    ]);

    $client = \DB::table('oauth_clients')
      ->where('password_client', true)
      ->first();
    
    $response = Http::post(
      \Config::get('app.url') . '/oauth/token',
      [
        'grant_type' => 'password',
        'client_id' => $client->id,
        'client_secret' => $client->secret,
        'username' => $request->user_name,
        'password' => $request->password,
        'scope' => '',
      ]
    );
    
    $data = json_decode($response->body());
    if (!$response->ok()) return response()->json($data, 400);

    $this->setHttpOnlyCookie($data->refresh_token);

    return response()->json([
      'user' => User::where('user_name', '=', $request->user_name)->first(),
      'token_type' => $data->token_type,
      'expires_in' => $data->expires_in,
      'access_token' => $data->access_token,
      'refresh_token' => $data->refresh_token
    ], 200);
  }

  protected function setHttpOnlyCookie(string $refreshToken)
  {
    cookie()->queue(
      'refresh_token',
      $refreshToken,
      14400, // 10 days
      null,
      null,
      false,
      true, // httponly
      false,
      'Strict' //same-site
    );
  }

  public function refreshToken(Request $request)
  {
    $refresh_token = request()->cookie('refresh_token');

    abort_if(!$refresh_token, 400, 'Your request is missing a refresh token.');

    $client = \DB::table('oauth_clients')
      ->where('password_client', true)
      ->first();

    $response = Http::post(
      \Config::get('app.url') . '/oauth/token',
      [
        'grant_type' => 'refresh_token',
        'refresh_token' => $refresh_token,
        'client_id' => $client->id,
        'client_secret' => $client->secret,
        'scope' => ''
      ]
    );

    $data = json_decode($response->body());

    if (!$response->ok()) {
      cookie()->queue(cookie()->forget('refresh_token'));
      return response()->json($data, 400);
    } 

    $this->setHttpOnlyCookie($data->refresh_token);

    return response()->json([
      'user' => User::where('user_name', '=', $request->user_name)->first(),
      'token_type' => $data->token_type,
      'expires_in' => $data->expires_in,
      'access_token' => $data->access_token,
      'refresh_token' => $data->refresh_token
    ], 200);
  }
  /**
   * Logout user (Revoke the token)
   *
   * @return [string] message
   */
  public function logout(Request $request)
  {
    $request->user()->token()->revoke();
    cookie()->queue(cookie()->forget('refresh_token'));

    return response()->json([
      'message' => 'Successfully logged out'
    ]);
  }

  /**
   * Get the authenticated User
   *
   * @return [json] user object
   */
  public function user(Request $request)
  {
    return response()->json($request->user());
  }
}
