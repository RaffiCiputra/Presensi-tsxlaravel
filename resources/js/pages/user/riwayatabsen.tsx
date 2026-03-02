import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Clock, Calendar, MapPin } from "lucide-react";

interface AttendanceItem {
  id: number;
  date: string;        // ISO string
  checkIn: string;
  checkOut: string;
  status: "Hadir" | "Terlambat" | "Izin" | "Alpha";
  location?: string;
}

const mockData: AttendanceItem[] = [
  {
    id: 1,
    date: "2026-03-01",
    checkIn: "09:01",
    checkOut: "17:05",
    status: "Terlambat",
    location: "Kantor Pusat",
  },
  {
    id: 2,
    date: "2026-02-29",
    checkIn: "08:55",
    checkOut: "17:02",
    status: "Hadir",
    location: "Kantor Pusat",
  },
];

export function RiwayatAbsen() {
  return (
    <div className="user-attendance-container">
      <div className="user-attendance-header">
        <div>
          <h1 className="user-attendance-title">Riwayat Absen</h1>
          <p className="user-attendance-subtitle">
            Lihat riwayat kehadiranmu dalam beberapa hari terakhir.
          </p>
        </div>
      </div>

      <Card className="user-attendance-card">
        <CardContent className="user-attendance-card-content">
          {mockData.length === 0 ? (
            <div className="user-attendance-empty">
              <Calendar className="user-attendance-empty-icon" />
              <p>Belum ada data absen.</p>
              <p className="user-attendance-empty-subtitle">
                Lakukan absen terlebih dahulu untuk melihat riwayat di sini.
              </p>
            </div>
          ) : (
            <div className="user-attendance-list">
              {mockData.map((item) => {
                const dateObj = new Date(item.date);
                const tanggal = dateObj.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });
                const hari = dateObj.toLocaleDateString("id-ID", {
                  weekday: "long",
                });

                const statusClass =
                  item.status === "Hadir"
                    ? "status-badge hadir"
                    : item.status === "Terlambat"
                    ? "status-badge terlambat"
                    : item.status === "Izin"
                    ? "status-badge izin"
                    : "status-badge alpha";

                return (
                  <div key={item.id} className="user-attendance-item">
                    <div className="user-attendance-date">
                      <span className="user-attendance-day">{hari}</span>
                      <span className="user-attendance-date-text">
                        {tanggal}
                      </span>
                    </div>

                    <div className="user-attendance-detail">
                      <div className="user-attendance-times">
                        <div className="time-row">
                          <Clock className="time-icon" />
                          <span>Masuk: {item.checkIn}</span>
                        </div>
                        <div className="time-row">
                          <Clock className="time-icon" />
                          <span>Pulang: {item.checkOut}</span>
                        </div>
                      </div>

                      {item.location && (
                        <div className="user-attendance-location">
                          <MapPin className="location-icon" />
                          <span>{item.location}</span>
                        </div>
                      )}

                      <div className="user-attendance-status">
                        <Badge className={statusClass}>{item.status}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
