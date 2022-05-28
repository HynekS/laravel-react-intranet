<?php

namespace App;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_name', 'full_name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function akce()
    {
        return $this->hasMany('App\Akce', 'user_id');
    }

    /**
     * Find the user instance for the given username.
     *
     * @param  string  $username
     * @return \App\User
     */
    public function findForPassport($username)
    {
        return self::where('user_name', $username)->first(); // change column name whatever you use in credentials
    }

    /**
     * Validate the password of the user for the Passport password grant.
     *
     * @param  string  $password
     * @return bool
     */
    public function validateForPassportPasswordGrant($password)
    {
        if (Hash::check($password, $this->password)) return true;
        // $password = 'test_password';
        $legacy_salt = 'FWiZqz1q7rvji7bo4Vmg';
        $legacy_hash = sha1(md5($password) . md5($legacy_salt));

        $isMatching = ($legacy_hash == $this->password);
        if ($isMatching) {
            $this->password = Hash::make($password);
            $this->save();
        }

        return ($isMatching);
    }
}
