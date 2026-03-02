<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaceRegistration extends Model
{
    const UPDATED_AT = null;

    protected $table = 'face_registration';
    protected $fillable = ['user_id', 'face_encoding'];
    protected $casts = ['registered_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
