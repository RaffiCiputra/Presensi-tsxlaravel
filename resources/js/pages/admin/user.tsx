import { useState, useEffect, useCallback } from "react";
import {
  UserPlus, Search, MoreVertical, Edit, Trash2, Key,
  Loader2, AlertCircle, X, CheckCircle, Eye, EyeOff,
  ShieldCheck, ShieldOff, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

function getToken(): string {
  return localStorage.getItem("token") ?? "";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.message ??
      (Object.values(data?.errors ?? {}) as string[][]).flat().join(" ") ??
      "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
type UserRole = "admin" | "user";

interface ApiUser {
  id: number;
  name: string;
  email: string;
  nik: string | null;
  phone: string | null;
  position: string | null;
  address: string | null;
  role: UserRole;
  is_confirmed: boolean;
  created_at: string;
}

interface FormState {
  name: string;
  email: string;
  nik: string;
  password: string;
  position: string;
  phone: string;
  address: string;
  role: UserRole;
}

const EMPTY_FORM: FormState = {
  name: "", email: "", nik: "", password: "",
  position: "", phone: "", address: "", role: "user",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
interface Toast { id: number; message: string; type: "success" | "error" }

function ToastList({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          pointerEvents: "all",
          display: "flex", alignItems: "center", gap: 10,
          background: t.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${t.type === "success" ? "#86efac" : "#fecaca"}`,
          borderRadius: 8, padding: "10px 14px", minWidth: 280,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          animation: "slideIn .2s ease",
        }}>
          {t.type === "success"
            ? <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            : <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />}
          <span style={{ fontSize: 13, color: t.type === "success" ? "#15803d" : "#dc2626", flex: 1 }}>{t.message}</span>
          <button onClick={() => onRemove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <X size={13} color="#9ca3af" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, title, description, confirmLabel = "Ya, Lanjutkan", onConfirm, onCancel, loading, danger = false }: {
  open: boolean; title: string; description: string; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <AlertCircle size={20} color={danger ? "#dc2626" : "#d97706"} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>{description}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>Batal</Button>
          <Button size="sm" disabled={loading} onClick={onConfirm}
            style={{ background: danger ? "#dc2626" : "#d97706", color: "#fff", border: "none" }}>
            {loading && <Loader2 size={13} className="animate-spin mr-1" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── ROLE BADGE ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    admin: { bg: "#eff6ff", color: "#1d4ed8", label: "Admin" },
    user:  { bg: "#f0fdf4", color: "#15803d", label: "User"  },
  };
  const s = map[role] ?? { bg: "#f3f4f6", color: "#374151", label: role };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {s.label}
    </span>
  );
}

// ─── PW INPUT ─────────────────────────────────────────────────────────────────
function PwInput({ value, onChange, placeholder, required, minLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required} minLength={minLength}
        style={{ paddingRight: 38 }} />
      <button type="button" onClick={() => setShow((v) => !v)}
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>{label}</Label>
      {children}
    </div>
  );
}

// ─── INLINE ERROR ─────────────────────────────────────────────────────────────
function InlineError({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "8px 12px", marginTop: 12 }}>
      <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "#dc2626" }}>{msg}</span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function UsersPage() {
  const [users, setUsers]       = useState<ApiUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRole]   = useState("all");
  const [toasts, setToasts]     = useState<Toast[]>([]);

  // Form dialog
  const [isFormOpen, setFormOpen]   = useState(false);
  const [editing, setEditing]       = useState<ApiUser | null>(null);
  const [form, setForm]             = useState<FormState>(EMPTY_FORM);
  const [formErr, setFormErr]       = useState("");
  const [saving, setSaving]         = useState(false);

  // Reset pw dialog
  const [isResetOpen, setResetOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<ApiUser | null>(null);
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [resetErr, setResetErr]     = useState("");
  const [resetting, setResetting]   = useState(false);

  // Confirms
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [statusTarget, setStatusTarget] = useState<ApiUser | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [roleTarget, setRoleTarget]     = useState<ApiUser | null>(null);
  const [pendingRole, setPendingRole]   = useState<UserRole>("user");
  const [roleSaving, setRoleSaving]     = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const toast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true); setApiError(null);
    try   { setUsers(await apiFetch<ApiUser[]>("/admin/users")); }
    catch (e: unknown) { setApiError((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Filtered ───────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ||
            (u.nik ?? "").includes(q) || (u.position ?? "").toLowerCase().includes(q)) &&
           (roleFilter === "all" || u.role === roleFilter);
  });

  // ── Create / Edit ──────────────────────────────────────────────────────────
  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormErr(""); setFormOpen(true); };
  const openEdit   = (u: ApiUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, nik: u.nik ?? "", password: "",
              position: u.position ?? "", phone: u.phone ?? "", address: u.address ?? "", role: u.role });
    setFormErr(""); setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormErr("");
    if (!form.name.trim() || !form.email.trim()) return setFormErr("Nama dan email wajib diisi.");
    if (!form.nik.trim()) return setFormErr("NIK wajib diisi.");
    if (!editing && form.password.length < 8) return setFormErr("Password minimal 8 karakter.");

    setSaving(true);
    try {
      if (editing) {
        const payload = { ...form } as Partial<FormState>;
        if (!payload.password) delete payload.password;
        const updated = await apiFetch<ApiUser>(`/admin/users/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setUsers((p) => p.map((u) => u.id === updated.id ? updated : u));
        toast(`User "${updated.name}" berhasil diperbarui.`, "success");
      } else {
        const created = await apiFetch<ApiUser>("/admin/users", { method: "POST", body: JSON.stringify(form) });
        setUsers((p) => [...p, created]);
        toast(`User "${created.name}" berhasil ditambahkan.`, "success");
      }
      setFormOpen(false);
    } catch (e: unknown) { setFormErr((e as Error).message); }
    finally { setSaving(false); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/admin/users/${deleteTarget.id}`, { method: "DELETE" });
      setUsers((p) => p.filter((u) => u.id !== deleteTarget.id));
      toast(`User "${deleteTarget.name}" berhasil dihapus.`, "success");
    } catch (e: unknown) { toast((e as Error).message, "error"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  // ── Status toggle ──────────────────────────────────────────────────────────
  const doStatusToggle = async () => {
    if (!statusTarget) return;
    setStatusSaving(true);
    const next = !statusTarget.is_confirmed;
    try {
      const updated = await apiFetch<ApiUser>(`/admin/users/${statusTarget.id}`, {
        method: "PUT", body: JSON.stringify({ is_confirmed: next }),
      });
      setUsers((p) => p.map((u) => u.id === updated.id ? { ...u, is_confirmed: next } : u));
      toast(`Status "${statusTarget.name}" → ${next ? "Confirmed" : "Unconfirmed"}.`, "success");
    } catch (e: unknown) { toast((e as Error).message, "error"); }
    finally { setStatusSaving(false); setStatusTarget(null); }
  };

  // ── Role change ────────────────────────────────────────────────────────────
  const doRoleChange = async () => {
    if (!roleTarget) return;
    setRoleSaving(true);
    try {
      const updated = await apiFetch<ApiUser>(`/admin/users/${roleTarget.id}`, {
        method: "PUT", body: JSON.stringify({ role: pendingRole }),
      });
      setUsers((p) => p.map((u) => u.id === updated.id ? updated : u));
      toast(`Role "${roleTarget.name}" → ${pendingRole}.`, "success");
    } catch (e: unknown) { toast((e as Error).message, "error"); }
    finally { setRoleSaving(false); setRoleTarget(null); }
  };

  // ── Reset password ─────────────────────────────────────────────────────────
  const openReset = (u: ApiUser) => { setResetTarget(u); setNewPw(""); setConfirmPw(""); setResetErr(""); setResetOpen(true); };

  const doResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setResetErr("");
    if (newPw.length < 8) return setResetErr("Password minimal 8 karakter.");
    if (newPw !== confirmPw) return setResetErr("Konfirmasi password tidak cocok.");
    if (!resetTarget) return;
    setResetting(true);
    try {
      await apiFetch(`/admin/users/${resetTarget.id}`, { method: "PUT", body: JSON.stringify({ password: newPw }) });
      toast(`Password "${resetTarget.name}" berhasil direset.`, "success");
      setResetOpen(false);
    } catch (e: unknown) { setResetErr((e as Error).message); }
    finally { setResetting(false); }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>

      <ToastList toasts={toasts} onRemove={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      {/* Confirms */}
      <ConfirmDialog open={!!deleteTarget} danger title="Hapus User"
        description={`Yakin hapus "${deleteTarget?.name}"? Tindakan ini permanen.`}
        confirmLabel="Ya, Hapus" onConfirm={doDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />

      <ConfirmDialog open={!!statusTarget} title="Ubah Status"
        description={`Ubah status "${statusTarget?.name}" ke ${statusTarget?.is_confirmed ? "Unconfirmed" : "Confirmed"}?`}
        confirmLabel="Ya, Ubah" onConfirm={doStatusToggle} onCancel={() => setStatusTarget(null)} loading={statusSaving} />

      <ConfirmDialog open={!!roleTarget} title="Ubah Role"
        description={`Ubah role "${roleTarget?.name}" dari "${roleTarget?.role}" → "${pendingRole}"?`}
        confirmLabel="Ya, Ubah Role" onConfirm={doRoleChange} onCancel={() => setRoleTarget(null)} loading={roleSaving} />

      {/* Reset Password Dialog */}
      <Dialog open={isResetOpen} onOpenChange={setResetOpen}>
        <DialogContent style={{ maxWidth: 400 }}>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            User: <strong>{resetTarget?.name}</strong>
          </p>
          <form onSubmit={doResetPassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Password Baru *">
              <PwInput value={newPw} onChange={setNewPw} placeholder="Min. 8 karakter" required minLength={8} />
            </Field>
            <Field label="Konfirmasi Password *">
              <PwInput value={confirmPw} onChange={setConfirmPw} placeholder="Ulangi password baru" required />
            </Field>
            <InlineError msg={resetErr} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setResetOpen(false)} disabled={resetting}>Batal</Button>
              <Button type="submit" size="sm" disabled={resetting}>
                {resetting && <Loader2 size={13} className="animate-spin mr-1" />} Reset Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent style={{ maxWidth: 580 }}>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit — ${editing.name}` : "Tambah User Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 4 }}>
              <Field label="Nama Lengkap *">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
              </Field>
              <Field label="Email *">
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="john@example.com" />
              </Field>
              <Field label="NIK *">
                <Input value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} required placeholder="16 digit NIK" />
              </Field>
              <Field label={editing ? "Password (kosongkan jika tidak diubah)" : "Password *"}>
                <PwInput value={form.password} onChange={(v) => setForm({ ...form, password: v })}
                  placeholder={editing ? "••••••••" : "Min. 8 karakter"} required={!editing} minLength={8} />
              </Field>
              <Field label="Role *">
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Jabatan / Posisi">
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Staff IT" />
              </Field>
              <Field label="No. Telepon">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08123456789" />
              </Field>
              <Field label="Alamat">
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat lengkap" />
              </Field>
            </div>
            <InlineError msg={formErr} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)} disabled={saving}>
                <X size={13} className="mr-1" /> Batal
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving && <Loader2 size={13} className="animate-spin mr-1" />}
                {editing ? "Simpan Perubahan" : "Tambah User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Page ── */}
      <div className="users-page-container">

        {/* Header */}
        <div className="users-header">
          <div className="users-header-content">
            <h1>Users Management</h1>
            <p>Kelola akun, role, dan status pengguna</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
              <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button className="users-add-btn" onClick={openCreate}>
              <UserPlus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }}>
            <AlertCircle size={16} color="#dc2626" />
            <span style={{ fontSize: 13, color: "#dc2626", flex: 1 }}>{apiError}</span>
            <Button variant="ghost" size="sm" onClick={fetchUsers}>Coba lagi</Button>
          </div>
        )}

        {/* Filters */}
        <Card className="users-filter-card">
          <CardContent style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px" }}>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={15} style={{ position: "absolute", left: 10, color: "#9ca3af", pointerEvents: "none" }} />
              <Input placeholder="Cari nama, email, NIK, jabatan…" value={search}
                onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
            </div>
            <Select value={roleFilter} onValueChange={setRole}>
              <SelectTrigger style={{ width: 160 }}><SelectValue placeholder="Filter Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="users-table-card">
          <CardHeader className="users-table-header">
            <CardTitle className="users-table-title">Semua Users ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                <Loader2 size={28} className="animate-spin" style={{ color: "#9ca3af" }} />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>No. HP</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: user.role === "admin" ? "#eff6ff" : "#f0fdf4",
                            color: user.role === "admin" ? "#1d4ed8" : "#15803d",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 14,
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, fontSize: 14 }}>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: 13, color: "#6b7280" }}>{user.email}</TableCell>
                      <TableCell style={{ fontSize: 13 }}>{user.nik ?? "—"}</TableCell>
                      <TableCell style={{ fontSize: 13 }}>{user.position ?? "—"}</TableCell>
                      <TableCell style={{ fontSize: 13 }}>{user.phone ?? "—"}</TableCell>
                      <TableCell><RoleBadge role={user.role} /></TableCell>
                      <TableCell>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                          textTransform: "uppercase", letterSpacing: "0.04em",
                          background: user.is_confirmed ? "#f0fdf4" : "#fef9c3",
                          color: user.is_confirmed ? "#15803d" : "#92400e",
                        }}>
                          {user.is_confirmed ? "Confirmed" : "Unconfirmed"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" style={{ padding: "4px 8px" }}>
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" style={{ minWidth: 210 }}>

                            <DropdownMenuItem onClick={() => openEdit(user)} style={{ cursor: "pointer", fontSize: 13 }}>
                              <Edit size={14} className="mr-2" /> Edit Data
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => openReset(user)} style={{ cursor: "pointer", fontSize: 13 }}>
                              <Key size={14} className="mr-2" /> Reset Password
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Toggle Status */}
                            <DropdownMenuItem onClick={() => setStatusTarget(user)} style={{ cursor: "pointer", fontSize: 13 }}>
                              {user.is_confirmed
                                ? <><ShieldOff size={14} className="mr-2" style={{ color: "#d97706" }} /> Set Unconfirmed</>
                                : <><ShieldCheck size={14} className="mr-2" style={{ color: "#16a34a" }} /> Set Confirmed</>}
                            </DropdownMenuItem>

                            {/* Change Role */}
                            <DropdownMenuItem style={{ cursor: "pointer", fontSize: 13 }} onClick={() => {
                              const next: UserRole = user.role === "admin" ? "user" : "admin";
                              setPendingRole(next); setRoleTarget(user);
                            }}>
                              <ShieldCheck size={14} className="mr-2" style={{ color: "#7c3aed" }} />
                              Ubah Role → {user.role === "admin" ? "User" : "Admin"}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => setDeleteTarget(user)}
                              style={{ cursor: "pointer", fontSize: 13, color: "#dc2626" }}>
                              <Trash2 size={14} className="mr-2" /> Hapus User
                            </DropdownMenuItem>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>
                        Tidak ada user yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}