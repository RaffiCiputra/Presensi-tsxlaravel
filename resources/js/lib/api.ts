// resources/js/lib/api.ts
import axios from "axios";

// Axios instance
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH INTERFACES
// ============================================

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  nik?: string | null;
  phone?: string | null;
  avatar?: string | null;
  position?: string | null;
  bio?: string | null;
  address?: string | null;
  is_confirmed: boolean;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserData;
  token: string;
}

export interface MeResponse {
  user: UserData;
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>("/api/login", credentials),

  logout: () => api.post<{ message: string }>("/api/logout"),

  me: () => api.get<MeResponse>("/api/me"),
};

// ============================================
// CALENDAR EVENT INTERFACES
// ============================================

export interface ApiEvent {
  id: number;
  title: string;
  description: string | null;
  event_at: string;
  notify_before: number;
  staff_name: string | null;
  created_by: string | null; // ✅ Fix: nullable sesuai model
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  notifyBefore?: number;
  staffName?: string;
  createdBy?: string; // ✅ Fix: nullable jadi optional
  reminderSent?: boolean;
}

// ─── MAPPER (PERBAIKAN KECIL) ──────────────────────────────
export const mapApiToCalendar = (e: ApiEvent): CalendarEvent => ({
  id: String(e.id),
  title: e.title,
  date: new Date(e.event_at),
  description: e.description ?? undefined,
  notifyBefore: e.notify_before,
  staffName: e.staff_name ?? undefined,
  createdBy: e.created_by ?? undefined, // ✅ Fix: handle null
  reminderSent: e.reminder_sent,
});


export const calendarAPI = {
  // semua user (admin & user)
  getAll: () => api.get<ApiEvent[]>("/api/events"),
  getUpcoming: () => api.get<ApiEvent[]>("/api/events/upcoming"),

  // admin only
  create: (data: {
    title: string;
    description?: string | null;
    event_at: string;
    notify_before?: number;
    staff_name?: string | null;
    created_by?: string;
  }) => api.post<ApiEvent>("/api/admin/events", data),

  updateAdmin: (
    id: string | number,
    data: Partial<{
      title: string;
      description: string | null;
      event_at: string;
      notify_before: number;
      staff_name: string | null;
      reminder_sent: boolean;
    }>
  ) => api.put<ApiEvent>(`/api/admin/events/${id}`, data),

  delete: (id: string | number) => api.delete(`/api/admin/events/${id}`),

  // dipakai user/CalendarReminder untuk update reminder_sent
  updateReminder: (
    id: string | number,
    data: Partial<{
      title: string;
      description: string | null;
      event_at: string;
      notify_before: number;
      staff_name: string | null;
      reminder_sent: boolean;
    }>
  ) => api.put<ApiEvent>(`/api/events/${id}`, data),
};


// ============================================
// ATTENDANCE INTERFACES
// ============================================

export interface ApiAttendance {
  id: number;
  user_id: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: "on_time" | "late" | "absent";
}

export interface ApiAbsensiRecord {
  user_id: number;
  name: string;
  nik: string | null;
  position: string | null;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: "on_time" | "late" | "absent";
}

export interface AttendanceRecord {
  id: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: "on_time" | "late" | "absent";
}

export interface AbsensiRecord {
  userId: number;
  name: string;
  nik: string | null;
  position: string | null;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: "on_time" | "late" | "absent";
}

// ============================================
// ATTENDANCE API
// ============================================

export const attendanceAPI = {
  // User endpoints
  checkIn: () =>
    api.post<{ message: string; attendance: ApiAttendance }>(
      "/api/user/check-in"
    ),

  // dipakai untuk face recognition check-out
  checkOut: (data?: {
    face_verified?: boolean;
    face_score?: number;
    location?: string;
  }) =>
    api.post<{ message: string; attendance: ApiAttendance }>(
      "/api/user/check-out",
      data
    ),

  getRiwayat: () => api.get<ApiAttendance[]>("/api/user/riwayat-absen"),

  // Admin endpoints
  getAbsensi: (params?: { start_date?: string; end_date?: string }) =>
    api.get<ApiAbsensiRecord[]>("/api/admin/absensi", { params }),

  exportAbsensi: () =>
    api.get("/api/admin/absensi/export", { responseType: "blob" }),
};

// Alias opsional, kalau mau pakai fungsi terpisah di admin:
export function getAdminAbsensi(params?: {
  start_date?: string;
  end_date?: string;
}) {
  return attendanceAPI.getAbsensi(params);
}

// ============================================
// MAPPERS
// ============================================

export const mapApiToAttendance = (a: ApiAttendance): AttendanceRecord => ({
  id: a.id,
  date: a.date,
  time_in: a.time_in,
  time_out: a.time_out,
  status: a.status,
});

export const mapApiToAbsensi = (a: ApiAbsensiRecord): AbsensiRecord => ({
  userId: a.user_id,
  name: a.name,
  nik: a.nik,
  position: a.position,
  date: a.date,
  timeIn: a.time_in,
  timeOut: a.time_out,
  status: a.status,
});

// ============================================
// CASH FLOW INTERFACES
// ============================================

export interface ApiCashFlow {
  id: number;
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  created_by: number;
  created_at: string;
}

export interface ApiCashFlowSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface CashFlowRecord {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdBy: number;
  createdAt: string;
}

export interface CashFlowInput {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

// ============================================
// CASH FLOW API
// ============================================

export const cashFlowAPI = {
  // User endpoints - untuk melihat cash flow milik user yang login
  getUserCashFlow: () =>
    api.get<{ data: ApiCashFlow[]; summary: ApiCashFlowSummary }>(
      "/api/user/cash-flow"
    ),

  // User endpoints - untuk create cash flow baru
  create: (data: CashFlowInput) =>
    api.post<{ message: string; data: ApiCashFlow }>(
      "/api/user/cash-flow",
      data
    ),

  // Admin endpoints - untuk melihat semua cash flow dari semua user
  getAll: () =>
    api.get<{ data: ApiCashFlow[]; summary: ApiCashFlowSummary }>(
      "/api/admin/cash-flow"
    ),

  // Admin endpoints - export ke CSV
  export: () =>
    api.get("/api/admin/cash-flow/export", { responseType: "blob" }),
};

// ============================================
// CASH FLOW MAPPER
// ============================================

export const mapApiToCashFlow = (c: ApiCashFlow): CashFlowRecord => ({
  id: c.id,
  description: c.description,
  amount: parseFloat(c.amount),
  type: c.type,
  date: c.date,
  createdBy: c.created_by,
  createdAt: c.created_at,
});
