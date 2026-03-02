import { Users, Clock, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const attendanceData = [
  { date: "Mon", Hadir: 45, Telat: 5, "Tidak Masuk": 3 },
  { date: "Tue", Hadir: 48, Telat: 3, "Tidak Masuk": 2 },
  { date: "Wed", Hadir: 46, Telat: 4, "Tidak Masuk": 3 },
  { date: "Thu", Hadir: 50, Telat: 2, "Tidak Masuk": 1 },
  { date: "Fri", Hadir: 47, Telat: 4, "Tidak Masuk": 2 },
  { date: "Sat", Hadir: 30, Telat: 1, "Tidak Masuk": 0 },
];

const cashFlowData = [
  { month: "Jan", "Uang Masuk": 45000, "Uang Keluar": 32000 },
  { month: "Feb", "Uang Masuk": 52000, "Uang Keluar": 38000 },
  { month: "Mar", "Uang Masuk": 48000, "Uang Keluar": 35000 },
  { month: "Apr", "Uang Masuk": 61000, "Uang Keluar": 42000 },
  { month: "May", "Uang Masuk": 55000, "Uang Keluar": 40000 },
  { month: "Jun", "Uang Masuk": 58000, "Uang Keluar": 43000 },
];

const recentAttendance = [
  { id: 1, name: "Alice Johnson", time: "08:45 AM", status: "Hadir", type: "Check In" },
  { id: 2, name: "Bob Smith", time: "09:15 AM", status: "Telat", type: "Check In" },
  { id: 3, name: "Charlie Brown", time: "08:30 AM", status: "Hadir", type: "Check In" },
  { id: 4, name: "Diana Prince", time: "17:00 PM", status: "Hadir", type: "Check Out" },
  { id: 5, name: "Ethan Hunt", time: "08:50 AM", status: "Hadir", type: "Check In" },
];

const recentActivities = [
  { id: 1, text: "New user registered: Sarah Wilson", time: "5 min ago", type: "user" },
  { id: 2, text: "Cash flow updated: +$5,000 Uang Masuk", time: "15 min ago", type: "cash" },
  { id: 3, text: "Attendance marked: 45 employees Hadir", time: "1 hour ago", type: "attendance" },
  { id: 4, text: "System backup completed", time: "2 hours ago", type: "system" },
];

export function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Users,
      colorClass: "stat-primary",
    },
    {
      title: "Today's Attendance",
      value: "142",
      change: "91%",
      trend: "up",
      icon: Clock,
      colorClass: "stat-success",
    },
    {
      title: "Cash In",
      value: "$58,450",
      change: "+18.2%",
      trend: "up",
      icon: TrendingUp,
      colorClass: "stat-cash-in",
    },
    {
      title: "Cash Out",
      value: "$43,200",
      change: "+8.5%",
      trend: "up",
      icon: TrendingDown,
      colorClass: "stat-danger",
    },
    {
      title: "Current Balance",
      value: "$15,250",
      change: "+9.7%",
      trend: "up",
      icon: Wallet,
      colorClass: "stat-purple",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Ringkasan statistik dan aktivitas terbaru di sini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className={`stat-card ${stat.colorClass}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-card-header">
                  <div className="stat-icon-wrapper">
                    <Icon className="stat-icon" />
                  </div>
                  <div className="stat-badge">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="stat-badge-icon" />
                    ) : (
                      <ArrowDownRight className="stat-badge-icon" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="stat-card-body">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                </div>
                <div className="stat-card-glow"></div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Attendance Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Absensi Perminggu</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Hadir" fill="#2596be" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Telat" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Tidak Masuk" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cash Flow Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Alur Kas</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Uang Masuk"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Uang Keluar"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="tables-grid">
          {/* Recent Attendance */}
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Absensi Terbaru</h3>
            </div>
            <div className="table-content">
              {recentAttendance.map((record, index) => (
                <div key={record.id} className="attendance-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="attendance-avatar">
                    {record.name.charAt(0)}
                  </div>
                  <div className="attendance-info">
                    <p className="attendance-name">{record.name}</p>
                    <p className="attendance-meta">
                      {record.time} • {record.type}
                    </p>
                  </div>
                  <div className={`attendance-badge badge-${record.status.toLowerCase()}`}>
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Aktivitas Terbaru</h3>
            </div>
            <div className="table-content">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="activity-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className={`activity-icon activity-${activity.type}`}>
                    <Activity size={16} />
                  </div>
                  <div className="activity-info">
                    <p className="activity-text">{activity.text}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}