import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { faceAPI } from "../../lib/api";

export function FaceRegisterPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Bersihkan stream saat unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // paling aman untuk semua device
      });

      console.log("Got stream:", stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          console.log(
            "Video loaded:",
            videoRef.current?.videoWidth,
            videoRef.current?.videoHeight
          );
          videoRef.current
            ?.play()
            .catch((err) => console.error("Error calling video.play()", err));
        };
      }

      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage("Unable to access camera. Please check permissions.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
    }
    setIsCameraActive(false);
  };

  // Capture 1 frame dari video sebagai File
  const capturePhotoAsFile = async (): Promise<File | null> => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const file = new File([blob], "face-register.jpg", {
            type: "image/jpeg",
          });
          resolve(file);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleRegisterFace = async () => {

    if (!isCameraActive) {
      await startCamera();
      return;
    }

    setLoading(true);

    try {
      const photoFile = await capturePhotoAsFile();
      if (!photoFile) {
        throw new Error("Failed to capture photo from camera.");
      }

      await faceAPI.register(photoFile);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      stopCamera();
    } catch (error: any) {
      console.error("Face register error:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to register face"
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-register-page">
      <div className="face-register-header">
        <h1 className="page-title">Face Registration</h1>
        <p className="page-subtitle">
          Register your face once to enable face recognition attendance
        </p>
      </div>

      {showSuccess && (
        <div className="success-alert animate-slide-down">
          <CheckCircle className="alert-icon" />
          <div className="alert-content">
            <p className="alert-title">Face Registered Successfully!</p>
            <p className="alert-description">
              Your face has been saved as reference for future attendance.
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

      <div className="face-register-card">
        <div className="camera-section">
          {/* Video SELALU dirender supaya videoRef tidak null */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`camera-video ${
              isCameraActive ? "" : "camera-video-hidden"
            }`}
          />
          {!isCameraActive && (
            <div className="camera-placeholder">
              <Camera className="size-12" />
              <p>Camera is off. Click the button below to start.</p>
            </div>
          )}
        </div>

        <div className="action-section">
          <h3 className="action-title">Capture Your Face</h3>
          <p className="action-description">
            Make sure your face is clearly visible and well lit before capturing.
          </p>

          <div className="action-buttons">
            <Button
              onClick={handleRegisterFace}
              className="primary-button"
              disabled={loading}
            >
              <Camera className="button-icon" />
              {loading
                ? "Processing..."
                : isCameraActive
                ? "Capture & Register"
                : "Start Camera"}
            </Button>

            {isCameraActive && (
              <Button
                onClick={stopCamera}
                className="secondary-button"
              >
                Turn Off Camera
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
