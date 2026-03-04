"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useNavigate, Link } from "react-router-dom";
import { Calendar as CalendarIcon, Bell, Clock, ArrowLeft } from "lucide-react";
import { calendarAPI, type CalendarEvent, mapApiToCalendar } from "../../lib/api";

export function CalendarReminder() {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const reminderSentRef = React.useRef(false);

  // Load events dari API
  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await calendarAPI.getAll();
      const mapped = response.data.map(mapApiToCalendar);
      setEvents(mapped.sort((a, b) => a.date.getTime() - b.date.getTime()));
    } catch (error) {
      console.error("Gagal memuat event:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset flag reminder setiap halaman dibuka
  React.useEffect(() => {
    reminderSentRef.current = false;
  }, []);

  // Minta izin notifikasi
  React.useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Sistem reminder H-1
  React.useEffect(() => {
    if (reminderSentRef.current || events.length === 0) return;

    const checkAndSendReminders = async () => {
      const now = new Date();
      const besokAwal = new Date(now);
      besokAwal.setDate(besokAwal.getDate() + 1);
      besokAwal.setHours(0, 0, 0, 0);

      const besokAkhir = new Date(besokAwal);
      besokAkhir.setHours(23, 59, 59, 999);

      const eventsBesok = events.filter(
        (e) => !e.reminderSent && e.date >= besokAwal && e.date <= besokAkhir
      );

      // Tandai sudah dicek (supaya tidak berulang)
      reminderSentRef.current = true;

      if (eventsBesok.length === 0) return;

      if ("Notification" in window) {
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;
        }

        for (const event of eventsBesok) {
          new Notification("🔔 Pengingat Event (H-1)", {
            body: `${event.title} akan dimulai besok pada ${event.date.toLocaleTimeString(
              "id-ID",
              { hour: "2-digit", minute: "2-digit" }
            )}`,
            icon: "/calendar-icon.png",
          });

          try {
            await calendarAPI.updateReminder(event.id, {
              title: event.title,
              description: event.description || null,
              event_at: event.date.toISOString(),
              notify_before: event.notifyBefore ?? 30,
              staff_name: event.staffName || null,
              reminder_sent: true,
            });
          } catch (error) {
            console.error("Gagal mengupdate status reminder:", error);
          }
        }

        // Refresh events setelah update reminder
        loadEvents();
      }
    };

    checkAndSendReminders();
  }, [events]);

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const threeDaysLater = new Date(startOfToday);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  threeDaysLater.setHours(23, 59, 59, 999);

  const upcomingEvents = events.filter((e) => e.date >= startOfToday);
  const todayEvents = events.filter((e) => isToday(e.date));
  const upcoming3Days = events.filter(
    (e) => e.date >= startOfToday && e.date <= threeDaysLater
  );

  return (
    <div className="calendar-reminder-container">
      {/* Header Navigation */}
      <div className="calendar-top-nav">
        <Button variant="ghost" onClick={handleGoBack} className="back-button">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali
        </Button>
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            Dashboard
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Kalender Event</span>
        </div>
      </div>

      {/* Banner 3 hari ke depan */}
      {upcoming3Days.length > 0 && (
        <Card className="mb-4 border-yellow-500 bg-yellow-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                ⚠️ Anda memiliki {upcoming3Days.length} event dalam 3 hari ke depan
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kartu Statistik */}
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-icon event-icon">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Event</p>
              <h3 className="stat-value">{events.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-icon today-icon">
              <Clock className="h-6 w-6" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Event Hari Ini</p>
              <h3 className="stat-value">{todayEvents.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-icon upcoming-icon">
              <Bell className="h-6 w-6" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Event Mendatang</p>
              <h3 className="stat-value">{upcomingEvents.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Event */}
      <Card className="events-card">
        <CardHeader>
          <CardTitle className="events-title">
            <CalendarIcon className="h-5 w-5" />
            Event Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="events-scroll">
            {upcomingEvents.length === 0 ? (
              <div className="no-events">
                <CalendarIcon className="h-12 w-12 empty-icon" />
                <p>Tidak ada event mendatang</p>
                <p className="empty-subtitle">Hubungi admin untuk menambah event</p>
              </div>
            ) : (
              <div className="events-list">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const besok = new Date(now);
                  besok.setDate(now.getDate() + 1);

                  const isTodayEvent = isToday(eventDate);
                  const isTomorrowEvent =
                    eventDate.getDate() === besok.getDate() &&
                    eventDate.getMonth() === besok.getMonth() &&
                    eventDate.getFullYear() === besok.getFullYear();

                  return (
                    <Card
                      key={event.id}
                      className={`event-item ${
                        isTodayEvent ? "border-red-500 bg-red-50" : ""
                      } ${isTomorrowEvent ? "border-yellow-500 bg-yellow-50" : ""}`}
                    >
                      <CardContent className="event-content">
                        <div className="event-date-badge">
                          <span className="event-day">{event.date.getDate()}</span>
                          <span className="event-month">
                            {monthNames[event.date.getMonth()].slice(0, 3)}
                          </span>
                        </div>
                        <div className="event-details">
                          <h4 className="event-title">{event.title}</h4>
                          {event.staffName && (
                            <div className="event-staff">
                              <Badge variant="outline" className="staff-badge">
                                {event.staffName}
                              </Badge>
                            </div>
                          )}
                          <div className="event-meta">
                            <Clock className="h-3 w-3" />
                            <span>
                              {event.date.toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {event.description && (
                            <p className="event-description">{event.description}</p>
                          )}
                          {event.notifyBefore && (
                            <div className="event-reminder">
                              <Bell className="h-3 w-3" />
                              <span>
                                Reminder{" "}
                                {event.notifyBefore < 60
                                  ? `${event.notifyBefore} menit`
                                  : `${event.notifyBefore / 60} jam`}{" "}
                                sebelum
                              </span>
                            </div>
                          )}
                          {isTodayEvent && (
                            <Badge className="bg-red-600 mt-2">Hari Ini</Badge>
                          )}
                          {isTomorrowEvent && (
                            <Badge className="bg-yellow-600 mt-2">
                              Besok (H-1)
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
