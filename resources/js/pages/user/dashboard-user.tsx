import {
  Bell,
  User,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useNavigate, Link } from "react-router-dom";

export function UserDashboardPage() {
  const navigate = useNavigate();

  const userInfo = {
    name: "Alice Johnson",
    employeeId: "EMP-2024-001",
    position: "Senior Developer",
    department: "Engineering",
    email: "alice.johnson@company.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    avatar: null,
  };

  const todayAttendance = {
    checkIn: "09:00 AM",
    checkOut: "-",
    status: "Hadir",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  const monthSummary = {
    totalDays: 22,
    present: 20,
    absent: 0,
    late: 1,
    leaves: 2,
    earlyLeave: 1,
    workingHours: "158h 30m",
  };

  const quickStats = [
    {
      label: "Present",
      value: monthSummary.present,
      total: monthSummary.totalDays,
    },
    {
      label: "Absent",
      value: monthSummary.absent,
    },
    {
      label: "Late",
      value: monthSummary.late,
    },
    {
      label: "Leaves",
      value: monthSummary.leaves,
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "Your attendance was recorded",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      message: "Leave request approved",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      message: "New policy update available",
      time: "2 days ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="user-dashboard-page">
      {/* Header */}
      <div className="user-dashboard-header">
        <div>
          <h1 className="user-dashboard-title">
            Hallo, {userInfo.name.split(" ")[0]}! 👋
          </h1>
          <p className="user-dashboard-subtitle">{todayAttendance.date}</p>
        </div>
        <button className="notification-button-user">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="notification-badge-user">{unreadCount}</span>
          )}
        </button>
      </div>

      <div className="user-dashboard-content">
        {/* Profile Card */}
        <Card className="user-profile-card animate-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="user-avatar-large">
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="user-avatar-initial">
                    {userInfo.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="user-profile-name">{userInfo.name}</h2>
                <p className="user-profile-position">{userInfo.position}</p>
                <p className="user-profile-id">ID: {userInfo.employeeId}</p>
                <div className="user-contact-info">
                  <div className="contact-info-item">
                    <Mail className="size-4 text-gray-icon" />
                    <span className="contact-text">
                      {userInfo.email}
                    </span>
                  </div>
                  <div className="contact-info-item">
                    <Phone className="size-4 text-gray-icon" />
                    <span className="contact-text">
                      {userInfo.phone}
                    </span>
                  </div>
                  <div className="contact-info-item">
                    <MapPin className="size-4 text-gray-icon" />
                    <span className="contact-text">
                      {userInfo.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance Card */}
        <Card className="today-attendance-card animate-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title-user">Today's Attendance</h3>
              <Badge className="badge-hadir">{todayAttendance.status}</Badge>
            </div>
            <div className="today-attendance-details">
              <div
                className="attendance-time-item"
                onClick={() => navigate("/user/check-in")}
              >
                <div className="attendance-time-icon check-in-bg">
                  <Clock className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="attendance-time-label">Check In</p>
                  <p className="attendance-time-value">
                    {todayAttendance.checkIn}
                  </p>
                </div>
              </div>
              <div className="attendance-time-divider" />
              <div
                className="attendance-time-item"
                onClick={() => navigate("/user/check-out")}
              >
                <div className="attendance-time-icon check-out-bg">
                  <Clock className="size-5 text-red-600" />
                </div>
                <div>
                  <p className="attendance-time-label">Check Out</p>
                  <p className="attendance-time-value">
                    {todayAttendance.checkOut}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month Summary */}
        <div className="month-summary-section">
          <h3 className="section-title-user mb-4">This Month Summary</h3>
          <div className="stats-grid-user">
            {quickStats.map((stat, index) => (
              <Card
                key={index}
                className="stat-card-user animate-card"
              >
                <CardContent className="p-4">
                  <div className="stat-value-user">
                    {stat.value}
                    {stat.total && (
                      <span className="stat-total-user">/{stat.total}</span>
                    )}
                  </div>
                  <div className="stat-label-user">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="additional-stats-grid">
            <Card className="additional-stat-card animate-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="stat-icon-wrapper bg-soft">
                    <Calendar className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="stat-label-small">Total Working Days</p>
                    <p className="stat-value-small">
                      {monthSummary.totalDays} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="additional-stat-card animate-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="stat-icon-wrapper bg-soft">
                    <TrendingUp className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="stat-label-small">Working Hours</p>
                    <p className="stat-value-small">
                      {monthSummary.workingHours}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Notifications */}
        <Card className="notifications-card-user animate-card overflow-hidden">
          <CardContent className="p-0">
            <div className="notifications-header-user">
              <h3 className="section-title-user">Recent Notifications</h3>
            </div>
            <div className="notifications-list-user">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item-user ${
                    notification.unread ? "unread" : ""
                  }`}
                >
                  <div className="notification-indicator-user" />
                  <div className="flex-1">
                    <p className="notification-message-user">
                      {notification.message}
                    </p>
                    <p className="notification-time-user">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title-user mb-4">Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link
              to="/user/riwayat-absen"
              className="quick-action-btn"
            >
              <div className="quick-action-icon-wrap bg-soft">
                <Calendar className="size-5 text-primary" />
              </div>
              <span className="quick-action-label">
                View Full Attendance
              </span>
            </Link>

            <Link
              to="/user/profile"
              className="quick-action-btn"
            >
              <div className="quick-action-icon-wrap bg-soft">
                <User className="size-5 text-primary" />
              </div>
              <span className="quick-action-label">
                Edit Profile
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
