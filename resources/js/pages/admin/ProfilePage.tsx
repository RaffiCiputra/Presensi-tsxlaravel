import { useState } from "react";
import { Camera, Mail, User, Lock, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const attendanceHistory = [
  { id: 1, date: "2026-02-12", checkIn: "08:45 AM", checkOut: "17:30 PM", status: "on-time" },
  { id: 2, date: "2026-02-11", checkIn: "09:15 AM", checkOut: "17:45 PM", status: "late" },
  { id: 3, date: "2026-02-10", checkIn: "08:30 AM", checkOut: "17:15 PM", status: "on-time" },
  { id: 4, date: "2026-02-09", checkIn: "08:55 AM", checkOut: "17:00 PM", status: "on-time" },
  { id: 5, date: "2026-02-08", checkIn: "-", checkOut: "-", status: "absent" },
];

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    department: "IT Department",
    role: "Admin",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const stats = {
    totalAttendance: 45,
    onTime: 40,
    late: 3,
    absent: 2,
    attendanceRate: 89,
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Change password logic here
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and settings
        </p>
      </div>

      {/* Profile Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="size-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="size-16 text-blue-600 dark:text-blue-400" />
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 size-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="size-4" />
                </Button>
              </div>

              <h2 className="text-xl font-bold mb-1">{formData.name}</h2>
              <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                {formData.role}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {formData.department}
              </p>

              <div className="w-full space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{formData.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{stats.totalAttendance}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Days</p>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-xl">
                <p className="text-3xl font-bold text-green-600">{stats.onTime}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">On Time</p>
              </div>

              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-xl">
                <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Late</p>
              </div>

              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-xl">
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Absent</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="size-8 text-blue-600" />
                  <div>
                    <p className="font-semibold">Attendance Rate</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Great performance this month!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{stats.attendanceRate}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    disabled
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label>Update Face Recognition Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Camera className="size-8 text-gray-400" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="size-4 mr-2" />
                        Upload New Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a clear photo for facial recognition
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Lock className="size-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              record.status === "on-time"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : record.status === "late"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            }
                          >
                            {record.status === "on-time"
                              ? "On Time"
                              : record.status === "late"
                              ? "Late"
                              : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
