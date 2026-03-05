<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    const UPDATED_AT = null;

    protected $table = 'attendance';

    protected $fillable = [
        'user_id',
        'type',
        'date',
        'time',
        'photo_path',
        'face_verified',
        'face_score',
        'location',
    ];

    protected $casts = [
        'date'          => 'date',
        'face_verified' => 'boolean',
        'face_score'    => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
