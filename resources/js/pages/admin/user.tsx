import { useState } from "react";
import {
  UserPlus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
  import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Superadmin" | "User";
  department: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    department: "IT",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Superadmin",
    department: "Management",
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "User",
    department: "HR",
    status: "Active",
  },
  {
    id: 4,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "User",
    department: "Finance",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    department: "Marketing",
    status: "Inactive",
  },
];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User" as User["role"],
    department: "",
    status: "Active" as User["status"],
  });

  const [formError, setFormError] = useState("");

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.department.toLowerCase().includes(q);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "User",
      department: "",
      status: "Active",
    });
    setEditingUser(null);
    setFormError("");
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Nama dan email wajib diisi.");
      return;
    }
    if (!formData.department.trim()) {
      setFormError("Department wajib dipilih.");
      return;
    }

    if (editingUser) {
      // UPDATE
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)),
      );
    } else {
      // CREATE
      const nextId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser: User = {
        id: nextId,
        ...formData,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    });
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleResetPassword = (user: User) => {
    // di sini nanti bisa diganti dengan call API reset password
    window.alert(`Password untuk ${user.name} berhasil di-reset (dummy).`);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "Superadmin":
        return "role-badge role-badge-superadmin";
      case "Admin":
        return "role-badge role-badge-admin";
      default:
        return "role-badge role-badge-user";
    }
  };

  return (
    <div className="users-page-container">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-content">
          <h1>Users Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="users-add-btn" onClick={openCreateDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>

          <DialogContent className="users-dialog">
            <DialogHeader className="users-dialog-header">
              <DialogTitle className="users-dialog-title">
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="users-form">
              <div className="users-form-grid">
                <div className="users-form-group">
                  <Label htmlFor="name" className="users-form-label">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="users-form-input"
                  />
                </div>

                <div className="users-form-group">
                  <Label htmlFor="email" className="users-form-label">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="users-form-input"
                  />
                </div>

                <div className="users-form-group">
                  <Label htmlFor="role" className="users-form-label">
                    Jabatan
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value as User["role"],
                      })
                    }
                  >
                    <SelectTrigger className="users-form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">Staff</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Superadmin">Superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="users-form-group">
                  <Label htmlFor="department" className="users-form-label">
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger className="users-form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="users-form-group">
                  <Label htmlFor="status" className="users-form-label">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as User["status"],
                      })
                    }
                  >
                    <SelectTrigger className="users-form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Aktif</SelectItem>
                      <SelectItem value="Inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Photo (dummy) */}
              <div className="users-photo-section">
                <Label className="users-form-label">Profile Photo</Label>
                <div className="users-photo-upload">
                  <div className="users-photo-placeholder">
                    <Camera className="users-photo-icon" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="users-photo-btn"
                  >
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="users-photo-section">
                <Label className="users-form-label">
                  Face Recognition Photo
                </Label>
                <div className="users-photo-upload">
                  <div className="users-photo-placeholder users-photo-placeholder-square">
                    <Camera className="users-photo-icon" />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="users-photo-btn mb-1"
                    >
                      Upload Face Photo
                    </Button>
                    <p className="users-photo-hint">
                      Upload a clear photo of the user's face for facial
                      recognition
                    </p>
                  </div>
                </div>
              </div>

              {formError && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#b91c1c",
                    marginTop: 4,
                  }}
                >
                  {formError}
                </p>
              )}

              <div className="users-form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="users-cancel-btn"
                >
                  Cancel
                </Button>
                <Button type="submit" className="users-submit-btn">
                  {editingUser ? "Update User" : "Add User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="users-filter-card">
        <CardContent className="users-filter-content">
          <div className="users-search-wrapper">
            <Search className="users-search-icon" />
            <Input
              placeholder="Search users by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="users-search-input"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="users-filter-select">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Superadmin">Superadmin</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="users-table-card">
        <CardHeader className="users-table-header">
          <CardTitle className="users-table-title">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="users-table-content">
          <Table className="users-table">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="user-avatar-cell">
                      <div className="user-avatar">
                        <span>{user.name.charAt(0)}</span>
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "Active"
                          ? "status-badge status-badge-active"
                          : "status-badge status-badge-inactive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="users-action-btn"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="users-dropdown-menu"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEdit(user)}
                          className="users-dropdown-item"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="users-dropdown-item"
                          onClick={() => handleResetPassword(user)}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="users-dropdown-item users-dropdown-item-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No users found with current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
