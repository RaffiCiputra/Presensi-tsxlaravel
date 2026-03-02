import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { MainLayoutUser } from "./components/layout/MainLayoutUser";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";

// Admin pages
import { DashboardPage as DashboardAdmin } from "./pages/admin/dashboard";
import { AttendancePage as AttendanceAdmin } from "./pages/admin/absensi";
import { UsersPage as UsersAdmin } from "./pages/admin/user";
import { CashFlowPage as CashFlowAdmin } from "./pages/admin/alurkas";
import { SettingsPage as SettingsAdmin } from "./pages/admin/setting";
import { NotFoundPage as AdminNotFound } from "./pages/admin/NotFoundPage";
import { CalendarPage } from "./pages/admin/kalender";

// User pages
import { UserDashboardPage } from "./pages/user/dashboard-user";
import { ProfilePage } from "./pages/user/profile";
import { CashFlowPage as CashFlowUser } from "./pages/user/alurkas";
import { CheckInPage } from "./pages/user/check-in";
import { CheckOutPage } from "./pages/user/check-out";
import { RiwayatAbsen } from "./pages/user/riwayatabsen";
import { CalendarReminder } from "./pages/user/kalender";

export const router = createBrowserRouter([
  // Root = Login
  {
    path: "/",
    element: <LoginPage />,
  },

  // Admin routes (prefix /admin)
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardAdmin /> },
      { path: "attendance", element: <AttendanceAdmin /> },
      { path: "users", element: <UsersAdmin /> },
      { path: "cash-flow", element: <CashFlowAdmin /> },
      { path: "settings", element: <SettingsAdmin /> },
      { path: "kalender", element: <CalendarPage /> },
      { path: "*", element: <AdminNotFound /> },
    ],
  },

  // User routes (prefix /user)
  {
    path: "/user",
    element: (
      <ProtectedRoute requiredRole="user">
        <MainLayoutUser />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <UserDashboardPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "cash-flow", element: <CashFlowUser /> },
      { path: "check-in", element: <CheckInPage /> },
      { path: "check-out", element: <CheckOutPage /> },
      { path: "riwayat-absen", element: <RiwayatAbsen /> },
      { path: "calendar", element: <CalendarReminder /> },
    ],
  },
]);
