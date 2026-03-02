import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  User2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { attendanceAPI } from "../../lib/api";

type AdminAttendanceRow = {
  user_id: number;
  name: string;
  nik: string | null;
  position: string | null;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: "on_time" | "late" | "absent";
};

export function AttendancePage() {
  const [records, setRecords] = useState<AdminAttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filter tanggal
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    loadAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params: Record<string, string> = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await attendanceAPI.getAbsensi(params);
      setRecords(response.data as AdminAttendanceRow[]);
    } catch (error: any) {
      console.error("Failed to load attendance:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to load attendance data"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusLabel = (status: AdminAttendanceRow["status"]) => {
    switch (status) {
      case "on_time":
        return "On Time";
      case "late":
        return "Late";
      default:
        return "Absent";
    }
  };

  const statusVariant = (status: AdminAttendanceRow["status"]) => {
    switch (status) {
      case "on_time":
        return "default" as const;
      case "late":
        return "secondary" as const;
      default:
        return "destructive" as const;
    }
  };

  const statusClass = (status: AdminAttendanceRow["status"]) => {
    switch (status) {
      case "on_time":
        return "admin-att-status-on-time";
      case "late":
        return "admin-att-status-late";
      default:
        return "admin-att-status-absent";
    }
  };

  const uniqueUsersCount = new Set(records.map((r) => r.user_id)).size;
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter((r) => r.date === today);

  const todayPresent = todayRecords.filter((r) => r.status !== "absent").length;
  const todayAbsent = todayRecords.filter((r) => r.status === "absent").length;

  return (
    <div className="admin-att-page">
      {/* Header */}
      <div className="admin-att-header">
        <div>
          <h1 className="admin-att-title">Attendance Overview</h1>
          <p className="admin-att-subtitle">
            Monitor check-in and check-out activity of all staff
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive" className="admin-att-alert">
          <XCircle className="admin-att-alert-icon" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="admin-att-stats-grid">
        <Card className="admin-att-stat-card">
          <CardContent className="admin-att-stat-content">
            <div className="admin-att-stat-icon admin-att-stat-icon-primary">
              <User2 className="admin-att-stat-icon-svg" />
            </div>
            <div className="admin-att-stat-info">
              <p className="admin-att-stat-label">Total Staff</p>
              <p className="admin-att-stat-value">{uniqueUsersCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-att-stat-card">
          <CardContent className="admin-att-stat-content">
            <div className="admin-att-stat-icon admin-att-stat-icon-success">
              <CheckCircle className="admin-att-stat-icon-svg" />
            </div>
            <div className="admin-att-stat-info">
              <p className="admin-att-stat-label">Present Today</p>
              <p className="admin-att-stat-value">{todayPresent}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-att-stat-card">
          <CardContent className="admin-att-stat-content">
            <div className="admin-att-stat-icon admin-att-stat-icon-danger">
              <XCircle className="admin-att-stat-icon-svg" />
            </div>
            <div className="admin-att-stat-info">
              <p className="admin-att-stat-label">Absent Today</p>
              <p className="admin-att-stat-value">{todayAbsent}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-att-stat-card">
          <CardContent className="admin-att-stat-content">
            <div className="admin-att-stat-icon admin-att-stat-icon-info">
              <Activity className="admin-att-stat-icon-svg" />
            </div>
            <div className="admin-att-stat-info">
              <p className="admin-att-stat-label">Total Records</p>
              <p className="admin-att-stat-value">{records.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Info */}
      <Card className="admin-att-filter-card">
        <CardContent className="admin-att-filter-content">
          <div className="admin-att-filter-dates">
            <div className="admin-att-filter-field">
              <label className="admin-att-filter-label">
                <Calendar className="admin-att-filter-label-icon" />
                Start Date
              </label>
              <input
                type="date"
                className="admin-att-filter-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="admin-att-filter-field">
              <label className="admin-att-filter-label">
                <Calendar className="admin-att-filter-label-icon" />
                End Date
              </label>
              <input
                type="date"
                className="admin-att-filter-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-att-filter-actions">
            <button
              className="admin-att-filter-button"
              onClick={loadAttendance}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filter"}
            </button>
            <div className="admin-att-filter-meta">
              <Clock className="admin-att-filter-meta-icon" />
              <span>
                Today:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="admin-att-table-card">
        <CardHeader>
          <CardTitle className="admin-att-table-title">
            <Activity className="admin-att-table-title-icon" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="admin-att-table-wrapper">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((row) => (
                  <TableRow key={`${row.user_id}-${row.date}`}>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{row.nik || "-"}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.position || "-"}</TableCell>
                    <TableCell>{formatTime(row.time_in)}</TableCell>
                    <TableCell>{formatTime(row.time_out)}</TableCell>
                    <TableCell>
                      <div className="admin-att-table-location">
                        <MapPin className="admin-att-table-location-icon" />
                        Office - Building A
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(row.status)}
                        className={`admin-att-status-badge ${statusClass(
                          row.status
                        )}`}
                      >
                        {row.status === "on_time" && (
                          <CheckCircle className="admin-att-status-icon" />
                        )}
                        {row.status === "late" && (
                          <Clock className="admin-att-status-icon" />
                        )}
                        {row.status === "absent" && (
                          <XCircle className="admin-att-status-icon" />
                        )}
                        {statusLabel(row.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="admin-att-table-empty">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
