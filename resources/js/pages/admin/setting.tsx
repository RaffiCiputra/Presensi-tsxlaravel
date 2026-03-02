import { useState } from "react";
import { Database, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Slider } from "../../components/ui/slider";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";

export function SettingsPage() {
  const [language, setLanguage] = useState("en");

  const [workHours, setWorkHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  const [faceRecognition, setFaceRecognition] = useState({
    threshold: 85,
    autoCapture: true,
    saveImages: true,
  });

  const [notifications, setNotifications] = useState({
    attendance: true,
    cashFlow: true,
    users: false,
    system: true,
  });

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleBackupDatabase = () => {
    toast.success("Database backup initiated!");
  };

  return (
    <div className="settings-page-container">
      <Toaster />

      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-description">
          Configure system preferences and options
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="settings-tabs">
        <TabsList className="settings-tabs-list">
          <TabsTrigger value="general" className="settings-tab-trigger">
            General
          </TabsTrigger>
          <TabsTrigger value="attendance" className="settings-tab-trigger">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="settings-tab-trigger">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="settings-tab-trigger">
            System
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="settings-tab-content">
          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">Language & Region</CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-form-group">
                <Label htmlFor="language" className="settings-label">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="settings-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="settings-form-group">
                <Label htmlFor="timezone" className="settings-label">
                  Timezone
                </Label>
                <Select defaultValue="asia-jakarta">
                  <SelectTrigger id="timezone" className="settings-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-jakarta">Asia/Jakarta (GMT+7)</SelectItem>
                    <SelectItem value="america-new-york">
                      America/New York (GMT-5)
                    </SelectItem>
                    <SelectItem value="europe-london">
                      Europe/London (GMT+0)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Settings */}
        <TabsContent value="attendance" className="settings-tab-content">
          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">Work Hours</CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-grid-2">
                <div className="settings-form-group">
                  <Label htmlFor="startTime" className="settings-label">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={workHours.start}
                    onChange={(e) =>
                      setWorkHours({ ...workHours, start: e.target.value })
                    }
                    className="settings-input"
                  />
                </div>

                <div className="settings-form-group">
                  <Label htmlFor="endTime" className="settings-label">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={workHours.end}
                    onChange={(e) =>
                      setWorkHours({ ...workHours, end: e.target.value })
                    }
                    className="settings-input"
                  />
                </div>
              </div>

              <p className="settings-helper-text">
                Employees checking in after start time will be marked as late
              </p>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">
                Face Recognition Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-slider-wrapper">
                <div className="settings-slider-header">
                  <Label htmlFor="threshold" className="settings-label">
                    Recognition Threshold
                  </Label>
                  <span className="settings-slider-value">
                    {faceRecognition.threshold}%
                  </span>
                </div>
                <Slider
                  id="threshold"
                  min={50}
                  max={100}
                  step={5}
                  value={[faceRecognition.threshold]}
                  onValueChange={(value) =>
                    setFaceRecognition({
                      ...faceRecognition,
                      threshold: value[0],
                    })
                  }
                  className="settings-slider"
                />
                <p className="settings-helper-text">
                  Higher values require more accurate face matches (recommended: 80–90%)
                </p>
              </div>

              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">Auto Capture</Label>
                  <p className="settings-switch-description">
                    Automatically capture when face is detected
                  </p>
                </div>
                <Switch
                  checked={faceRecognition.autoCapture}
                  onCheckedChange={(checked) =>
                    setFaceRecognition({ ...faceRecognition, autoCapture: checked })
                  }
                />
              </div>

              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">
                    Save Attendance Images
                  </Label>
                  <p className="settings-switch-description">
                    Store captured photos for record keeping
                  </p>
                </div>
                <Switch
                  checked={faceRecognition.saveImages}
                  onCheckedChange={(checked) =>
                    setFaceRecognition({ ...faceRecognition, saveImages: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">
                    Enable QR Code Check-in
                  </Label>
                  <p className="settings-switch-description">
                    Allow employees to check in using QR codes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="settings-form-group">
                <Label className="settings-label">QR Code Validity</Label>
                <Select defaultValue="60">
                  <SelectTrigger className="settings-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="settings-tab-content">
          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">
                    Attendance Notifications
                  </Label>
                  <p className="settings-switch-description">
                    Get notified about check-ins and late arrivals
                  </p>
                </div>
                <Switch
                  checked={notifications.attendance}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, attendance: checked })
                  }
                />
              </div>

              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">
                    Cash Flow Notifications
                  </Label>
                  <p className="settings-switch-description">
                    Receive updates about financial transactions
                  </p>
                </div>
                <Switch
                  checked={notifications.cashFlow}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, cashFlow: checked })
                  }
                />
              </div>

              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">
                    User Management Notifications
                  </Label>
                  <p className="settings-switch-description">
                    Alerts for new users and account changes
                  </p>
                </div>
                <Switch
                  checked={notifications.users}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, users: checked })
                  }
                />
              </div>

              <div className="settings-switch-wrapper">
                <div className="settings-switch-label-wrapper">
                  <Label className="settings-switch-title">
                    System Notifications
                  </Label>
                  <p className="settings-switch-description">
                    Important system updates and maintenance alerts
                  </p>
                </div>
                <Switch
                  checked={notifications.system}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, system: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="settings-tab-content">
          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-section">
                <h4 className="settings-section-title">Backup Database</h4>
                <p className="settings-section-description">
                  Create a backup of all system data including users, attendance records,
                  and transactions.
                </p>
                <Button
                  onClick={handleBackupDatabase}
                  variant="outline"
                  className="settings-button-outline"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </div>

              <div className="settings-section settings-section-border">
                <h4 className="settings-section-title">Auto Backup</h4>
                <div className="settings-switch-wrapper">
                  <p className="settings-switch-description">
                    Automatically backup database daily at midnight
                  </p>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-form-group">
                <Label className="settings-label">Keep Attendance Records</Label>
                <Select defaultValue="365">
                  <SelectTrigger className="settings-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="settings-form-group">
                <Label className="settings-label">Keep Transaction Records</Label>
                <Select defaultValue="730">
                  <SelectTrigger className="settings-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader className="settings-card-header">
              <CardTitle className="settings-card-title">
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="settings-card-content">
              <div className="settings-info-row">
                <span className="settings-info-label">Version</span>
                <span className="settings-info-value">1.0.0</span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Last Backup</span>
                <span className="settings-info-value">Feb 11, 2026 23:00</span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Database Size</span>
                <span className="settings-info-value">45.2 MB</span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Total Users</span>
                <span className="settings-info-value">156</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="settings-save-container">
        <Button onClick={handleSaveSettings} className="settings-save-button">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
