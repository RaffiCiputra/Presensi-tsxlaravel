import { useState, useEffect, useRef } from "react";
import {
  Camera,
  MapPin,
  Clock,
  Calendar,
  LogIn,
  CheckCircle,
  XCircle,
  Activity,
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

type AttendanceStatus = "on_time" | "late" | "absent";

export function CheckInPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLate, setIsLate] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Loading...");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get location and fetch history
  useEffect(() => {
    // TODO: ganti dengan geolocation API bila perlu
    setTimeout(() => {
      setCurrentLocation("Office - Building A, Floor 3");
    }, 1000);

    fetchAttendanceHistory();
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await attendanceAPI.getRiwayat();
      const mappedData = response.data.map(mapApiToAttendance);
      setAttendanceHistory(mappedData);
    } catch (error: any) {
      console.error("Failed to fetch attendance history:", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraActive(true);

      // Simulate face detection after 2 seconds
      setTimeout(() => {
        setFaceDetected(true);
      }, 2000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage("Unable to access camera. Please check permissions.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    setIsCameraActive(false);
    setFaceDetected(false);
  };

  const handleCheckIn = async () => {
    if (!isCameraActive) {
      await startCamera();
      return;
    }

    if (!faceDetected) {
      setErrorMessage("No face detected. Please position your face in the frame.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    setLoading(true);

    try {
      const currentHour = new Date().getHours();
      const isLateNow = currentHour >= 9;

      // Nanti ganti 0.95 dengan score asli dari engine face recognition
      await attendanceAPI.checkIn({
        // photo: fileDariCaptureKamera, // kalau nanti sudah implement capture
        face_verified: true,
        face_score: 0.95,
        location: currentLocation,
      });

      setIsLate(isLateNow);
      setShowSuccess(true);
      stopCamera();

      // Refresh history
      await fetchAttendanceHistory();

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Failed to check in");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      console.error("Check-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    switch (status) {
      case "on_time":
        return "status-badge-success";
      case "late":
        return "status-badge-warning";
      case "absent":
        return "status-badge-danger";
      default:
        return "status-badge-default";
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    return status === "on_time" ? "on-time" : status;
  };

  return (
    <div className="checkin-page">
      <div className="checkin-header">
        <h1 className="page-title">Check In</h1>
        <p className="page-subtitle">Start your workday with face recognition</p>
      </div>

      {showSuccess && (
        <div className="success-alert animate-slide-down">
          <CheckCircle className="alert-icon" />
          <div className="alert-content">
            <p className="alert-title">Check-In Successful!</p>
            <p className="alert-description">
              Your attendance has been recorded
              {isLate && " (Late arrival noted)"}
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
        <div className="info-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="info-card-icon">
            <Clock className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Current Time</p>
            <p className="info-value">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="info-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="info-card-icon">
            <Calendar className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Today's Date</p>
            <p className="info-value">{currentTime.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="info-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="info-card-icon">
            <MapPin className="icon" />
          </div>
          <div className="info-card-content">
            <p className="info-label">Location</p>
            <p className="info-value">{currentLocation}</p>
          </div>
        </div>
      </div>

      {/* Action card */}
      <div className="action-card">
        {isCameraActive && (
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-video"
            />
            <div className="camera-overlay">
              <div className={`face-detection-frame ${faceDetected ? "detected" : ""}`}>
                {faceDetected && (
                  <div className="face-detected-badge">
                    <CheckCircle className="size-5" />
                    <span>Face Detected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="action-content">
          {!isCameraActive ? (
            <>
              <div className="action-icon-container">
                <LogIn className="action-icon" />
              </div>
              <h3 className="action-title">Face Recognition Check-In</h3>
              <p className="action-description">
                Click the button below to activate camera and verify your identity
              </p>
            </>
          ) : (
            <>
              <h3 className="action-title">Position Your Face</h3>
              <p className="action-description">
                {faceDetected
                  ? "Face detected! Click confirm to check in"
                  : "Align your face within the frame"}
              </p>
            </>
          )}

          <div className="action-buttons">
            <Button
              onClick={handleCheckIn}
              className="primary-button"
              disabled={(isCameraActive && !faceDetected) || loading}
            >
              <Camera className="button-icon" />
              {loading ? "Processing..." : isCameraActive ? "Confirm Check In" : "Start Camera"}
            </Button>
            {isCameraActive && (
              <Button
                onClick={stopCamera}
                className="secondary-button"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* History card */}
      <div className="history-card">
        <div className="card-header">
          <div className="header-content">
            <Activity className="header-icon" />
            <div>
              <h2 className="card-title">Recent Check-In History</h2>
              <p className="card-subtitle">Your recent attendance records</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Location</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((record, index) => (
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
                  <td data-label="Check In">
                    <div className="table-time">
                      <LogIn className="size-4" />
                      {formatTime(record.time_in)}
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
                      <Camera className="size-4" />
                      Face Recognition
                    </div>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${getStatusColor(record.status)}`}>
                      {record.status === "on_time" && <CheckCircle className="size-3" />}
                      {record.status === "late" && <XCircle className="size-3" />}
                      {formatStatus(record.status)}
                    </span>
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
