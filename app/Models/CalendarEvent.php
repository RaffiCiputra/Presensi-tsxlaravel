<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class CalendarEvent extends Model
{
    protected $table = 'calendar_events';

    protected $fillable = [
        'title',
        'description',
        'event_at',
        'notify_before',
        'staff_name',
        'created_by',
        'reminder_sent',
    ];

    protected $casts = [
        'event_at'      => 'datetime',
        'reminder_sent' => 'boolean',
    ];

    public function toFrontendArray(): array
    {
        $eventAt   = $this->event_at instanceof Carbon ? $this->event_at : Carbon::parse($this->event_at ?? now());
        $createdAt = $this->created_at instanceof Carbon ? $this->created_at : Carbon::parse($this->created_at ?? now());
        $updatedAt = $this->updated_at instanceof Carbon ? $this->updated_at : Carbon::parse($this->updated_at ?? now());

        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,
            'event_at'      => $eventAt->toISOString(),
            'notify_before' => $this->notify_before ?? 30,
            'staff_name'    => $this->staff_name,
            'created_by'    => $this->created_by,
            'reminder_sent' => (bool) $this->reminder_sent,
            'created_at'    => $createdAt->toISOString(),
            'updated_at'    => $updatedAt->toISOString(),
        ];
    }
}
