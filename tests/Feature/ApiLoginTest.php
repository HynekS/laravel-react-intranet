<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Laravel\Passport\{Passport, Client};

use App\User;

class ApiLoginTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        \Artisan::call('passport:install');
    }

    public function testGivenValidCredentialsOauthReturnsTokens()
    {   
        $user_name = 'Test User';
        $password = 'test_password';

        $user = factory(User::class)->create([
            'user_name' => $user_name,
            'password' => \Hash::make($password)
        ]);

        $client = factory(Client::class)->create(['user_id' => $user->id]);

        $client = \DB::table('oauth_clients')->where('password_client', 1)->first();

        $response = $this->post('/oauth/token', [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => $user_name,
            'password' => $password,
            'scope' => ''
        ]);
        
        $response->assertJsonStructure(['access_token', 'refresh_token']);
        $response->assertStatus(200);
    }

    public function testGivenValidCredentialsWithLegacyPasswordHashOauthReturnsTokens()
    {   

        $test_password = 'test_password';
        $legacy_salt = 'FWiZqz1q7rvji7bo4Vmg';
        $legacy_hash = sha1(md5($test_password) . md5($legacy_salt));

        $user = factory(User::class)->create([
            'user_name' => 'Test User',
            'password' => $legacy_hash
        ]);

        $client = factory(Client::class)->create(['user_id' => $user->id]);

        $client = \DB::table('oauth_clients')->where('password_client', 1)->first();

        $response = $this->post('/oauth/token', [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => 'Test User',
            'password' => $test_password,
            'scope' => ''
        ]);
        
        $response->assertJsonStructure(['access_token', 'refresh_token']);
        $response->assertStatus(200);
    }




    public function testCannotLoginWithInvalidCredential()
    {

        $test_user = new User(
            [
                'user_name' => "Test User",
                'full_name' => "Testus Testiculus",
                'password' => \Hash::make('test_password'),
                'active' => 1
            ]
        );
        $test_user->save();

        $response = $this->postJson('/api/auth/login', ['user_name' => $test_user->user_name, 'password' => 'invalid_password!']);

        $response->assertStatus(400);
    }


    public function testAuthenticatedUserGet200()
    {
        Passport::actingAs(
            factory(User::class)->create(),
            ['*']
        );

        $response = $this->getJson('/api/akce/2022');

        $response->assertStatus(200);
    }


    public function testUnauthenticatedUserGet401()
    {

        $response = $this->getJson('/api/akce/2022');

        $response->assertStatus(401);
    }
}
