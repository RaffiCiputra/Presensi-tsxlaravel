import { useState, useEffect } from "react";
import {
  QrCode,
  MapPin,
  Clock,
  Calendar,
  LogOut,
  CheckCircle,
  XCircle,
  Activity,
  Timer,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { attendanceAPI, AttendanceRecord, mapApiToAttendance } from "../../lib/api";


// Placeholder: nanti ganti implementasi dengan face-api.js / FaceIO / dll
async function runFaceRecognition(): Promise<{ verified: boolean; score: number }> {
  // TODO: implementasi deteksi wajah di sini
  // misal: kalau gagal deteksi atau wajah tidak match ⇒ return { verified: false, score: 0 }
  // sementara ini kita buat seolah-olah selalu sukses:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ verified: true, score: 0.95 });
    }, 2000); // simulasi delay proses face recog
  });
}

export function CheckOutPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Loading...");
  const [isScanning, setIsScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workDuration, setWorkDuration] = useState("Calculating...");
  const [loading, setLoading] = useState(false);
  const [checkOutHistory, setCheckOutHistory] = useState<AttendanceRecord[]>([]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get location and fetch history
  useEffect(() => {
    // TODO: bisa ganti dengan geolocation API kalau mau realtime
    setTimeout(() => {
      setCurrentLocation("Office - Building A, Floor 3");
    }, 1000);

    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await attendanceAPI.getRiwayat();
      const mappedData = response.data.map(mapApiToAttendance);
      const historyWithCheckOut = mappedData.filter((record) => record.time_out);
      setCheckOutHistory(historyWithCheckOut);

      // Calculate work duration for today (dari time_in sampai sekarang)
      const today = mappedData.find(
        (r) => r.date === new Date().toISOString().split("T")[0]
      );

      if (today && today.time_in) {
        const checkInTime = new Date(`${today.date} ${today.time_in}`);
        const now = new Date();
        const diffMs = now.getTime() - checkInTime.getTime();
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        setWorkDuration(`${diffHrs} hours ${diffMins} minutes`);
      }
    } catch (error: any) {
      console.error("Failed to fetch attendance history:", error);
    }
  };

  const handleCheckOut = async () => {
    setIsScanning(true);
    setLoading(true);

    try {
      // 1. Jalankan face recognition
      const result = await runFaceRecognition();

      if (!result.verified) {
        throw new Error("Face verification failed. Please try again.");
      }

      // 2. Kirim hasil verifikasi ke backend
      await attendanceAPI.checkOut({
        face_verified: true,
        face_score: result.score,
        location: currentLocation,
      });

      setShowSuccess(true);
      setIsScanning(false);

      // 3. Refresh history
      await fetchAttendanceHistory();

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to check out"
      );
      setShowError(true);
      setIsScanning(false);
      setTimeout(() => setShowError(false), 5000);
      console.error("Check-out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (timeIn: string | null, timeOut: string | null) => {
    if (!timeIn || !timeOut) return "-";

    const checkIn = new Date(`2000-01-01 ${timeIn}`);
    const checkOut = new Date(`2000-01-01 ${timeOut}`);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    return `${diffHrs}h ${diffMins}m`;
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1 className="page-title">Check Out</h1>
        <p className="page-subtitle">
          End your workday and record your departure
        </p>
      </div>

      {showSuccess && (
        <div className="success-alert animate-slide-down">
          <CheckCircle className="alert-icon" />
          <div className="alert-content">
            <p className="alert-title">Check-Out Successful!</p>
            <p className="alert-description">
              Have a great day! Your work hours have been recorded.
            </p>
          </div>
        </div>
      )}

      {showError && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="size-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Info cards */}
      <div className="info-cards">
        <div
          className="info-card animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="info-card-icon">
            <Clock className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Current Time</p>
            <p className="info-value">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <div
          className="info-card animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="info-card-icon">
            <Calendar className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Today's Date</p>
            <p className="info-value">{currentTime.toLocaleDateString()}</p>
          </div>
        </div>

        <div
          className="info-card animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="info-card-icon">
            <Timer className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Work Duration</p>
            <p className="info-value">{workDuration}</p>
          </div>
        </div>

        <div
          className="info-card animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="info-card-icon">
            <MapPin className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Location</p>
            <p className="info-value">{currentLocation}</p>
          </div>
        </div>
      </div>

      {/* Action card: face recog check-out */}
      <div className="action-card">
        {isScanning ? (
          <div className="scanning-container">
            <div className="qr-scanner-animation">
              <div className="scanner-line"></div>
              <QrCode className="qr-icon" />
            </div>
            <h3 className="action-title">Verifying Face...</h3>
            <p className="action-description">
              Please look at the camera while we verify your identity
            </p>
          </div>
        ) : (
          <div className="action-content">
            <div className="action-icon-container">
              <LogOut className="action-icon" />
            </div>
            <h3 className="action-title">Face Recognition Check-Out</h3>
            <p className="action-description">
              Use face recognition to securely complete your check-out
            </p>
            <div className="action-buttons">
              <Button
                onClick={handleCheckOut}
                className="primary-button"
                disabled={loading}
              >
                <QrCode className="button-icon" />
                {loading ? "Processing..." : "Start Face Scan"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* History card */}
      <div className="history-card">
        <div className="card-header">
          <div className="header-content">
            <Activity className="header-icon" />
            <div>
              <h2 className="card-title">Recent Check-Out History</h2>
              <p className="card-subtitle">Your recent departure records</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check Out</th>
                <th>Duration</th>
                <th>Location</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {checkOutHistory.map((record, index) => (
                <tr
                  key={record.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td data-label="Date">
                    <div className="table-date">
                      <Calendar className="size-4" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td data-label="Check Out">
                    <div className="table-time">
                      <LogOut className="size-4" />
                      {formatTime(record.time_out)}
                    </div>
                  </td>
                  <td data-label="Duration">
                    <div className="table-duration">
                      <Timer className="size-4" />
                      {calculateDuration(record.time_in, record.time_out)}
                    </div>
                  </td>
                  <td data-label="Location">
                    <div className="table-location">
                      <MapPin className="size-4" />
                      Office - Building A
                    </div>
                  </td>
                  <td data-label="Method">
                    <div className="table-method">
                      <QrCode className="size-4" />
                      Face Recognition
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
