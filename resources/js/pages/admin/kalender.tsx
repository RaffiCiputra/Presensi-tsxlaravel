"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useNavigate, Link } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Bell, 
  Clock, 
  ArrowLeft,
  Edit,
  Users,
  Save
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import { api, type ApiEvent, type CalendarEvent, mapApiToCalendar } from "../../lib/api";

export function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    description: "",
    time: "",
    notifyBefore: 30,
    staffName: "",
  });

  // Load events from API
  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiEvent[]>("/api/events");
      const mapped = response.data.map(mapApiToCalendar);
      setEvents(mapped.sort((a, b) => a.date.getTime() - b.date.getTime()));
    } catch (error) {
      console.error("Failed to load events:", error);
      alert("Gagal memuat event");
    } finally {
      setLoading(false);
    }
  };

  // Request notification permission
  React.useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    return { daysInMonth, startDay, year, month };
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !newEvent.title || !newEvent.time) {
      alert("Mohon isi Judul Event dan Waktu");
      return;
    }

    try {
      setLoading(true);
      const [hours, minutes] = newEvent.time.split(":").map(Number);
      const eventDate = new Date(selectedDate);
      eventDate.setHours(hours, minutes, 0, 0);

      const payload = {
        title: newEvent.title,
        description: newEvent.description || null,
        event_at: eventDate.toISOString(),
        notify_before: newEvent.notifyBefore,
        staff_name: newEvent.staffName || null,
        created_by: "Admin",
      };

      const response = await api.post<ApiEvent>("/api/admin/events", payload);
      const created = mapApiToCalendar(response.data);

      setEvents((prev) => [...prev, created].sort((a, b) => a.date.getTime() - b.date.getTime()));
      setNewEvent({ title: "", description: "", time: "", notifyBefore: 30, staffName: "" });
      setIsDialogOpen(false);
      setSelectedDate(null);
    } catch (error: any) {
      console.error("Failed to create event:", error);
      alert(error.response?.data?.message || "Gagal membuat event");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;

    try {
      setLoading(true);
      const payload = {
        title: editingEvent.title,
        description: editingEvent.description || null,
        event_at: editingEvent.date.toISOString(),
        notify_before: editingEvent.notifyBefore ?? 30,
        staff_name: editingEvent.staffName || null,
        reminder_sent: editingEvent.reminderSent ?? false,
      };

      const response = await api.put<ApiEvent>(`/api/admin/events/${editingEvent.id}`, payload);
      const updated = mapApiToCalendar(response.data);

      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? updated : e)).sort((a, b) => a.date.getTime() - b.date.getTime())
      );

      setIsEditDialogOpen(false);
      setEditingEvent(null);
    } catch (error: any) {
      console.error("Failed to update event:", error);
      alert(error.response?.data?.message || "Gagal mengupdate event");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus event ini?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/admin/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      alert(error.response?.data?.message || "Gagal menghapus event");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (event: CalendarEvent) => {
    setEditingEvent({ ...event });
    setIsEditDialogOpen(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const { daysInMonth, startDay, year, month } = getDaysInMonth(currentDate);
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const upcomingEvents = events.filter((e) => e.date >= new Date());
  const todayEvents = events.filter((e) => isToday(e.date));

  return (
    <div className="calendar-admin-container">
      {/* Header Navigation */}
      <div className="calendar-top-nav">
        <Button variant="ghost" onClick={handleGoBack} className="calendar-back-button">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali
        </Button>
        <div className="calendar-breadcrumb">
          <Link to="/admin/dashboard" className="calendar-breadcrumb-link">
            Dashboard
          </Link>
          <span className="calendar-breadcrumb-separator">/</span>
          <span className="calendar-breadcrumb-current">Event Calendar</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="calendar-stats-grid">
        <Card className="calendar-stat-card">
          <CardContent className="calendar-stat-content">
            <div className="calendar-stat-icon calendar-event-icon">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div className="calendar-stat-info">
              <p className="calendar-stat-label">Total Event</p>
              <h3 className="calendar-stat-value">{events.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="calendar-stat-card">
          <CardContent className="calendar-stat-content">
            <div className="calendar-stat-icon calendar-today-icon">
              <Clock className="h-6 w-6" />
            </div>
            <div className="calendar-stat-info">
              <p className="calendar-stat-label">Event Hari Ini</p>
              <h3 className="calendar-stat-value">{todayEvents.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="calendar-stat-card">
          <CardContent className="calendar-stat-content">
            <div className="calendar-stat-icon calendar-upcoming-icon">
              <Bell className="h-6 w-6" />
            </div>
            <div className="calendar-stat-info">
              <p className="calendar-stat-label">Event Mendatang</p>
              <h3 className="calendar-stat-value">{upcomingEvents.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="calendar-main-grid">
        {/* Calendar Card */}
        <Card className="calendar-view-card">
          <CardHeader className="calendar-view-header">
            <div className="calendar-navigation">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="calendar-nav-button"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="calendar-month-title">
                {monthNames[month]} {year}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="calendar-nav-button"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="calendar-weekdays-row">
              {weekDays.map((day) => (
                <div key={day} className="calendar-weekday-cell">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-days-grid">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day-cell calendar-empty-cell" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dayEvents = getEventsForDate(date);
                const today = isToday(date);

                return (
                  <Dialog 
                    key={day} 
                    open={selectedDate?.getDate() === day && selectedDate?.getMonth() === month ? isDialogOpen : false}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsDialogOpen(false);
                        setSelectedDate(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <button
                        className={cn(
                          "calendar-day-cell",
                          today && "calendar-today-cell",
                          dayEvents.length > 0 && "calendar-has-event-cell"
                        )}
                        onClick={() => {
                          setSelectedDate(date);
                          setIsDialogOpen(true);
                        }}
                      >
                        <span className="calendar-day-number">{day}</span>
                        {dayEvents.length > 0 && (
                          <Badge className="calendar-event-count-badge">{dayEvents.length}</Badge>
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="calendar-dialog-content">
                      <DialogHeader>
                        <DialogTitle className="calendar-dialog-title">
                          Tambah Event - {day} {monthNames[month]} {year}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="calendar-event-form">
                        <div className="calendar-form-group">
                          <Label htmlFor="title" className="calendar-form-label">Judul Event *</Label>
                          <Input
                            id="title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            placeholder="Contoh: Meeting Tim Marketing"
                            className="calendar-form-input"
                          />
                        </div>
                        <div className="calendar-form-group">
                          <Label htmlFor="staffName" className="calendar-form-label">Nama Staff/User</Label>
                          <Input
                            id="staffName"
                            value={newEvent.staffName}
                            onChange={(e) => setNewEvent({ ...newEvent, staffName: e.target.value })}
                            placeholder="Nama staff yang bertanggung jawab"
                            className="calendar-form-input"
                          />
                        </div>
                        <div className="calendar-form-group">
                          <Label htmlFor="time" className="calendar-form-label">Waktu *</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            className="calendar-form-input"
                          />
                        </div>
                        <div className="calendar-form-group">
                          <Label htmlFor="description" className="calendar-form-label">Deskripsi</Label>
                          <Textarea
                            id="description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            placeholder="Detail tambahan tentang event..."
                            rows={3}
                            className="calendar-form-textarea"
                          />
                        </div>
                        <div className="calendar-form-group">
                          <Label htmlFor="notify" className="calendar-form-label">Ingatkan Sebelum</Label>
                          <Select
                            value={newEvent.notifyBefore.toString()}
                            onValueChange={(value) =>
                              setNewEvent({ ...newEvent, notifyBefore: parseInt(value) })
                            }
                          >
                            <SelectTrigger className="calendar-form-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 menit</SelectItem>
                              <SelectItem value="15">15 menit</SelectItem>
                              <SelectItem value="30">30 menit</SelectItem>
                              <SelectItem value="60">1 jam</SelectItem>
                              <SelectItem value="120">2 jam</SelectItem>
                              <SelectItem value="1440">1 hari</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="calendar-dialog-footer">
                        <Button variant="outline" onClick={() => {
                          setIsDialogOpen(false);
                          setSelectedDate(null);
                        }} disabled={loading}>
                          Batal
                        </Button>
                        <Button onClick={handleAddEvent} className="calendar-add-event-button" disabled={loading}>
                          <Plus className="h-4 w-4 mr-2" />
                          {loading ? "Menyimpan..." : "Tambah Event"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Events List Card */}
        <Card className="calendar-events-list-card">
          <CardHeader>
            <div className="calendar-events-header">
              <div className="calendar-events-title-wrapper">
                <CalendarIcon className="h-5 w-5" />
                <CardTitle className="calendar-events-title">Event Mendatang</CardTitle>
              </div>
              <Badge variant="outline" className="calendar-staff-badge">
                <Users className="h-3 w-3 mr-1" />
                Dapat dilihat oleh semua staff
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="calendar-events-scroll-area">
              {upcomingEvents.length === 0 ? (
                <div className="calendar-no-events">
                  <CalendarIcon className="h-12 w-12 calendar-empty-icon" />
                  <p className="calendar-empty-text">Tidak ada event mendatang</p>
                  <p className="calendar-empty-subtext">Klik tanggal untuk menambah event</p>
                </div>
              ) : (
                <div className="calendar-events-list">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="calendar-event-item-card">
                      <CardContent className="calendar-event-item-content">
                        <div className="calendar-event-date-badge">
                          <span className="calendar-event-badge-day">{event.date.getDate()}</span>
                          <span className="calendar-event-badge-month">
                            {monthNames[event.date.getMonth()].slice(0, 3)}
                          </span>
                        </div>
                        <div className="calendar-event-details">
                          <h4 className="calendar-event-item-title">{event.title}</h4>
                          {event.staffName && (
                            <div className="calendar-event-staff-wrapper">
                              <Badge variant="outline" className="calendar-event-staff-badge">
                                {event.staffName}
                              </Badge>
                            </div>
                          )}
                          <div className="calendar-event-meta">
                            <Clock className="h-3 w-3" />
                            <span>
                              {event.date.toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {event.description && (
                            <p className="calendar-event-description">{event.description}</p>
                          )}
                          {event.notifyBefore && (
                            <div className="calendar-event-reminder">
                              <Bell className="h-3 w-3" />
                              <span>
                                Reminder {event.notifyBefore < 60 
                                  ? `${event.notifyBefore} menit` 
                                  : `${event.notifyBefore / 60} jam`} sebelumnya
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="calendar-event-actions">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(event)}
                            className="calendar-edit-button"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="calendar-delete-button"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="calendar-dialog-content">
          <DialogHeader>
            <DialogTitle className="calendar-dialog-title">Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <div className="calendar-event-form">
              <div className="calendar-form-group">
                <Label htmlFor="edit-title" className="calendar-form-label">Judul Event</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="calendar-form-input"
                />
              </div>
              <div className="calendar-form-group">
                <Label htmlFor="edit-staffName" className="calendar-form-label">Nama Staff/User</Label>
                <Input
                  id="edit-staffName"
                  value={editingEvent.staffName || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, staffName: e.target.value })}
                  className="calendar-form-input"
                />
              </div>
              <div className="calendar-form-group">
                <Label htmlFor="edit-time" className="calendar-form-label">Waktu</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingEvent.date.toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number);
                    const newDate = new Date(editingEvent.date);
                    newDate.setHours(hours, minutes);
                    setEditingEvent({ ...editingEvent, date: newDate });
                  }}
                  className="calendar-form-input"
                />
              </div>
              <div className="calendar-form-group">
                <Label htmlFor="edit-description" className="calendar-form-label">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={editingEvent.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="calendar-form-textarea"
                />
              </div>
              <div className="calendar-form-group">
                <Label htmlFor="edit-notify" className="calendar-form-label">Ingatkan Sebelum</Label>
                <Select
                  value={editingEvent.notifyBefore?.toString() || "30"}
                  onValueChange={(value) =>
                    setEditingEvent({ ...editingEvent, notifyBefore: parseInt(value) })
                  }
                >
                  <SelectTrigger className="calendar-form-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 menit</SelectItem>
                    <SelectItem value="15">15 menit</SelectItem>
                    <SelectItem value="30">30 menit</SelectItem>
                    <SelectItem value="60">1 jam</SelectItem>
                    <SelectItem value="120">2 jam</SelectItem>
                    <SelectItem value="1440">1 hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="calendar-dialog-footer">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleEditEvent} className="calendar-save-event-button" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
