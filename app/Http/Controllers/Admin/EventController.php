<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * List semua event (dipakai admin & user).
     */
    public function index()
    {
        try {
            $events = CalendarEvent::orderBy('event_at', 'asc')->get();
            $data = $events->map(fn ($event) => $event->toFrontendArray());

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Event index error', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to fetch events',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List event yang akan datang saja (opsional).
     */
    public function upcoming()
    {
        try {
            $now = now();

            $events = CalendarEvent::where('event_at', '>=', $now)
                ->orderBy('event_at', 'asc')
                ->get();

            $data = $events->map(fn ($event) => $event->toFrontendArray());

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Event upcoming error', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to fetch upcoming events',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin create event (dipakai CalendarPage.handleAddEvent).
     */
    public function store(Request $request)
    {
        Log::info('Creating event', ['payload' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'event_at'      => 'required|date',
            'notify_before' => 'nullable|integer|min:0',
            'staff_name'    => 'nullable|string|max:255',
            'created_by'    => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            Log::warning('Event validation failed', ['errors' => $validator->errors()]);

            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $event = CalendarEvent::create([
                'title'         => $request->title,
                'description'   => $request->description,
                'event_at'      => $request->event_at,
                'notify_before' => $request->notify_before ?? 30,
                'staff_name'    => $request->staff_name,
                'created_by'    => $request->created_by ?? 'Admin',
                'reminder_sent' => false,
            ]);

            Log::info('Event created', ['id' => $event->id]);

            return response()->json($event->toFrontendArray(), 201);
        } catch (\Exception $e) {
            Log::error('Event store error', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to create event',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update event (dipakai admin edit, dan user untuk set reminder_sent).
     */
    public function update(Request $request, $id)
    {
        $event = CalendarEvent::find($id);

        if (! $event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'         => 'sometimes|required|string|max:255',
            'description'   => 'nullable|string',
            'event_at'      => 'sometimes|required|date',
            'notify_before' => 'nullable|integer|min:0',
            'staff_name'    => 'nullable|string|max:255',
            'reminder_sent' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            Log::warning('Event update validation failed', ['errors' => $validator->errors()]);

            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data = [];

            if ($request->has('title')) {
                $data['title'] = $request->title;
            }
            if ($request->has('description')) {
                $data['description'] = $request->description;
            }
            if ($request->has('event_at')) {
                $data['event_at'] = $request->event_at;
            }
            if ($request->has('notify_before')) {
                $data['notify_before'] = $request->notify_before;
            }
            if ($request->has('staff_name')) {
                $data['staff_name'] = $request->staff_name;
            }
            if ($request->has('reminder_sent')) {
                $data['reminder_sent'] = (bool) $request->reminder_sent;
            }

            $event->update($data);
            $event->refresh();

            return response()->json($event->toFrontendArray());
        } catch (\Exception $e) {
            Log::error('Event update error', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to update event',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus event (dipakai CalendarPage.handleDeleteEvent).
     */
    public function destroy($id)
    {
        $event = CalendarEvent::find($id);

        if (! $event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        try {
            $event->delete();

            return response()->json([
                'message' => 'Event deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Event delete error', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to delete event',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Statistik event (opsional, untuk dashboard admin).
     */
    public function stats()
    {
        try {
            $now      = now();
            $today    = $now->copy()->startOfDay();
            $todayEnd = $now->copy()->endOfDay();

            $stats = [
                'total'    => CalendarEvent::count(),
                'today'    => CalendarEvent::whereBetween('event_at', [$today, $todayEnd])->count(),
                'upcoming' => CalendarEvent::where('event_at', '>=', $now)->count(),
                'past'     => CalendarEvent::where('event_at', '<', $now)->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Event stats error', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to fetch statistics',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
