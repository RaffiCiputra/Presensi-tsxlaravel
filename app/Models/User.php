<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nik',
        'phone',
        'avatar',
        'bio',
        'address',
        'position',
        'face_encoding',
        'is_confirmed',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'face_encoding',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_confirmed' => 'boolean',
        'password' => 'hashed',
    ];
}
