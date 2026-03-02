import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function UserDashboardPage() {
    const navigate = useNavigate();
    // User Info
    const userInfo = {
        name: "Alice Johnson",
        employeeId: "EMP-2024-001",
        position: "Senior Developer",
        department: "Engineering",
        email: "alice.johnson@company.com",
        phone: "+1 234 567 8900",
        location: "San Francisco, CA",
        avatar: null, // Set to null untuk gunakan initial
    };

    // Today's attendance
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

    // This month summary
    const monthSummary = {
        totalDays: 22,
        present: 20,
        absent: 0,
        late: 1,
        leaves: 2,
        earlyLeave: 1,
        workingHours: "158h 30m",
    };

    // Quick stats for display
    const quickStats = [
        {
            label: "Present",
            value: monthSummary.present,
            total: monthSummary.totalDays,
            bgColor: "bg-green-50 dark:bg-green-950/50",
            textColor: "text-green-600 dark:text-green-400",
            borderColor: "border-green-400 dark:border-green-600",
        },
        {
            label: "Absent",
            value: monthSummary.absent,
            bgColor: "bg-red-50 dark:bg-red-950/50",
            textColor: "text-red-600 dark:text-red-400",
            borderColor: "border-red-400 dark:border-red-600",
        },
        {
            label: "Late",
            value: monthSummary.late,
            bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
            textColor: "text-yellow-600 dark:text-yellow-400",
            borderColor: "border-yellow-400 dark:border-yellow-600",
        },
        {
            label: "Leaves",
            value: monthSummary.leaves,
            bgColor: "bg-blue-50 dark:bg-blue-950/50",
            textColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-400 dark:border-blue-600",
        },
    ];

    // Recent notifications
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
                        Hallo, {userInfo.name.split(" ")[0]}!
                    </h1>
                    <p className="user-dashboard-subtitle">
                        {todayAttendance.date}
                    </p>
                </div>
                <button className="notification-button-user">
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="notification-badge-user">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="user-dashboard-content">
                {/* Profile Card */}
                <Card className="user-profile-card">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
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

                            {/* User Details */}
                            <div className="flex-1">
                                <h2 className="user-profile-name">
                                    {userInfo.name}
                                </h2>
                                <p className="user-profile-position">
                                    {userInfo.position}
                                </p>
                                <p className="user-profile-id">
                                    ID: {userInfo.employeeId}
                                </p>

                                {/* Contact Info */}
                                <div className="user-contact-info">
                                    <div className="contact-info-item">
                                        <Mail className="size-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {userInfo.email}
                                        </span>
                                    </div>
                                    <div className="contact-info-item">
                                        <Phone className="size-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {userInfo.phone}
                                        </span>
                                    </div>
                                    <div className="contact-info-item">
                                        <MapPin className="size-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {userInfo.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Attendance Card */}
                <Card className="today-attendance-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="section-title-user">
                                Today's Attendance
                            </h3>
                            <Badge
                                variant={
                                    todayAttendance.status === "present"
                                        ? "default"
                                        : "secondary"
                                }
                                className={
                                    todayAttendance.status === "present"
                                        ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                        : ""
                                }
                            >
                                {todayAttendance.status}
                            </Badge>
                        </div>

                        <div className="today-attendance-details">
                            {/* Check In */}
                            <div
                                className="attendance-time-item cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition"
                                onClick={() => navigate("/user/check-in")}
                            >
                                <div className="attendance-time-icon check-in-bg">
                                    <Clock className="size-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="attendance-time-label">
                                        Check In
                                    </p>
                                    <p className="attendance-time-value">
                                        {todayAttendance.checkIn}
                                    </p>
                                </div>
                            </div>

                            <div className="attendance-time-divider" />

                            {/* Check Out */}
                            <div
                                className="attendance-time-item cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition"
                                onClick={() => navigate("/user/check-out")}
                            >
                                <div className="attendance-time-icon check-out-bg">
                                    <Clock className="size-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="attendance-time-label">
                                        Check Out
                                    </p>
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
                    <h3 className="section-title-user mb-4">
                        This Month Summary
                    </h3>

                    {/* Stats Grid */}
                    <div className="stats-grid-user">
                        {quickStats.map((stat, index) => (
                            <Card
                                key={index}
                                className={`stat-card-user border-2 ${stat.borderColor} ${stat.bgColor}`}
                            >
                                <CardContent className="p-4">
                                    <div
                                        className={`stat-value-user ${stat.textColor}`}
                                    >
                                        {stat.value}
                                        {stat.total && (
                                            <span className="stat-total-user">
                                                /{stat.total}
                                            </span>
                                        )}
                                    </div>
                                    <div className="stat-label-user text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Additional Stats */}
                    <div className="additional-stats-grid">
                        <Card className="additional-stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="stat-icon-wrapper bg-purple-50 dark:bg-purple-950/50">
                                        <Calendar className="size-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="stat-label-small text-gray-500 dark:text-gray-400">
                                            Total Working Days
                                        </p>
                                        <p className="stat-value-small text-gray-900 dark:text-gray-100">
                                            {monthSummary.totalDays} days
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="additional-stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="stat-icon-wrapper bg-indigo-50 dark:bg-indigo-950/50">
                                        <TrendingUp className="size-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="stat-label-small text-gray-500 dark:text-gray-400">
                                            Working Hours
                                        </p>
                                        <p className="stat-value-small text-gray-900 dark:text-gray-100">
                                            {monthSummary.workingHours}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Notifications */}
                <Card className="notifications-card-user overflow-hidden">
                    <CardContent className="p-0">
                        <div className="notifications-header-user border-b border-gray-200 dark:border-gray-700">
                            <h3 className="section-title-user">
                                Recent Notifications
                            </h3>
                        </div>
                        <div className="notifications-list-user">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item-user border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${notification.unread ? "unread" : ""}`}
                                >
                                    <div className="notification-indicator-user" />
                                    <div className="flex-1">
                                        <p className="notification-message-user text-gray-900 dark:text-gray-100">
                                            {notification.message}
                                        </p>
                                        <p className="notification-time-user text-gray-500 dark:text-gray-400">
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
                    <div className="quick-actions-grid gap-4">
                        <Link
                            to="/user/riwayat-absen"
                            className="quick-action-btn flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                View Full Attendance
                            </span>
                        </Link>

                        <Link
                            to="/user/profile"
                            className="quick-action-btn flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <User className="size-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                Edit Profile
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
