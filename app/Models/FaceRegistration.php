<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaceRegistration extends Model
{
    // Tidak pakai created_at & updated_at
    public $timestamps = false;

    protected $table = 'face_registration';

    protected $fillable = [
        'user_id',
        'face_encoding',
        'registered_at',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
