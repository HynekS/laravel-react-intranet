<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Laravel\Passport\Passport;

use App\User;

class ApiLoginTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        \Artisan::call('passport:install');
    }

    public function testLoginDoesWork()
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

        $response = $this->postJson('/api/auth/login', ['user_name' => $test_user->user_name, 'password' => 'test_password']);
    
        $response->assertStatus(200);
    }


    public function testLegacyLoginDoesWork()
    {
        
        $test_user = new User(
            [
                'user_name' => "Test User",
                'full_name' => "Testus Testiculus",
                'password' => sha1(md5('test_password') . md5('FWiZqz1q7rvji7bo4Vmg')),
                'active' => 1
            ]
        );
        $test_user->save();

        $response = $this->postJson('/api/auth/login', ['user_name' => $test_user->user_name, 'password' => 'test_password']);
    
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
    
        $response->assertStatus(401);
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
