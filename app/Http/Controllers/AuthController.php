<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\User;
 
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
   * @param  [string] email
   * @param  [string] password
   * @param  [boolean] remember_me
   * @return [string] access_token
   * @return [string] token_type
   * @return [string] expires_at
   */
  public function login(Request $request)
  {
    $request->validate([
      'user_name' => 'required|string',
      'password' => 'required|string',
    ]);
    $credentials = $request->only(['user_name', 'password']);
    if (!Auth::attempt($credentials)) {

      if ($this->tryLegacyHash($request)) {
        $user = User::where('user_name', $request->input('user_name'))->first();
        $user->password = Hash::make($request->input('password'));
        $user->save();
        return $this->createResponse($user, $request);
      } else {
        return response()->json([
          'message' => trans('auth.failed'),
        ], 401);
      }
    }
    return $this->createResponse($request->user(), $request);
  }

  private function tryLegacyHash($request, $salt = 'FWiZqz1q7rvji7bo4Vmg')
  {
    $user_name = $request->input('user_name');
    $password = $request->input('password');
    $user = User::where('user_name', $user_name)->first();
    $hash = sha1(md5($password) . md5($salt));
    return ($user && $hash == $user->password);
  }

  private function createResponse($user)
  {
    $tokenResult = $user->createToken('Personal Access Token');
    $token = $tokenResult->token;
    $token->save();

    return response()->json([
      'access_token' => $tokenResult->accessToken,
      'token_type' => 'Bearer',
      'expires_at' => Carbon::parse(
        $tokenResult->token->expires_at
      )->toDateTimeString(),
      'user' => $user
    ]); 
  }

  public function userRefreshToken(Request $request)
{
    $client = DB::table('oauth_clients')
        ->where('password_client', true)
        ->first();

    $data = [
        'grant_type' => 'refresh_token',
        'refresh_token' => $request->refresh_token,
        'client_id' => $client->id,
        'client_secret' => $client->secret,
        'scope' => ''
    ];
    $request = Request::create('/oauth/token', 'POST', $data);
    $content = json_decode(app()->handle($request)->getContent());

    return response()->json([
        'error' => false,
        'data' => [
            'meta' => [
                'token' => $content->access_token,
                'refresh_token' => $content->refresh_token,
                'type' => 'Bearer'
            ]
        ]
    ], Response::HTTP_OK);
}

  /**
   * Logout user (Revoke the token)
   *
   * @return [string] message
   */
  public function logout(Request $request)
  {
    $request->user()->token()->revoke();
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
