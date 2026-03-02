<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    const UPDATED_AT = null;

    protected $table = 'attendance';
    protected $fillable = ['user_id', 'type', 'date', 'time', 'photo_path'];
    protected $casts = ['date' => 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
