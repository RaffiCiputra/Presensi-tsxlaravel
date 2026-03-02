import { useState } from "react";
import { Camera, Edit2, Save, X, Lock, User, Mail, Phone, MapPin, Calendar, Briefcase, Shield, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface PendingChange {
  id: number;
  field: string;
  oldValue: string;
  newValue: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export function ProfilePage() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // User data (Read-only fields)
  const [userData] = useState({
    name: "Alice Johnson",
    nik: "3201234567890123",
    department: "Engineering",
    dateOfBirth: "1990-05-15",
    address: "123 Main Street, San Francisco, CA 94102",
    faceRecognitionRegistered: true,
    faceRegistrationDate: "2024-01-15",
  });

  // Editable fields (current values)
  const [editableData, setEditableData] = useState({
    position: "Senior Developer",
    email: "alice.johnson@company.com",
    phone: "+1 234 567 8900",
    avatar: null as string | null,
  });

  // Form data for editing
  const [editForm, setEditForm] = useState({
    email: editableData.email,
    phone: editableData.phone,
    position: editableData.position,
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Pending changes
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([
    {
      id: 1,
      field: "Email",
      oldValue: "alice.j@company.com",
      newValue: "alice.johnson@company.com",
      status: "approved",
      requestDate: "2024-02-10",
    },
  ]);

  const [changeIdCounter, setChangeIdCounter] = useState(2);

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    const changes: PendingChange[] = [];

    if (editForm.email !== editableData.email) {
      changes.push({
        id: changeIdCounter,
        field: "Email",
        oldValue: editableData.email,
        newValue: editForm.email,
        status: "pending",
        requestDate: new Date().toISOString().split('T')[0],
      });
      setChangeIdCounter(changeIdCounter + 1);
    }

    if (editForm.phone !== editableData.phone) {
      changes.push({
        id: changeIdCounter + 1,
        field: "Phone",
        oldValue: editableData.phone,
        newValue: editForm.phone,
        status: "pending",
        requestDate: new Date().toISOString().split('T')[0],
      });
      setChangeIdCounter(changeIdCounter + 2);
    }

    if (editForm.position !== editableData.position) {
      changes.push({
        id: changeIdCounter + 2,
        field: "Position",
        oldValue: editableData.position,
        newValue: editForm.position,
        status: "pending",
        requestDate: new Date().toISOString().split('T')[0],
      });
      setChangeIdCounter(changeIdCounter + 3);
    }

    if (changes.length > 0) {
      setPendingChanges([...pendingChanges, ...changes]);
      alert("✓ Changes submitted for admin approval");
    } else {
      alert("No changes detected");
    }

    setIsEditingPersonal(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      email: editableData.email,
      phone: editableData.phone,
      position: editableData.position,
    });
    setIsEditingPersonal(false);
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("⚠ Please fill all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("⚠ New passwords do not match!");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert("⚠ Password must be at least 8 characters long");
      return;
    }

    const passwordChange: PendingChange = {
      id: changeIdCounter,
      field: "Password",
      oldValue: "********",
      newValue: "********",
      status: "pending",
      requestDate: new Date().toISOString().split('T')[0],
    };

    setPendingChanges([...pendingChanges, passwordChange]);
    setChangeIdCounter(changeIdCounter + 1);
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    setIsEditingPassword(false);
    alert("✓ Password change request submitted for admin approval");
  };

  const handleRequestFaceRecognition = () => {
    if (userData.faceRecognitionRegistered) {
      const faceChange: PendingChange = {
        id: changeIdCounter,
        field: "Face Recognition",
        oldValue: `Registered on ${userData.faceRegistrationDate}`,
        newValue: "Re-registration Request",
        status: "pending",
        requestDate: new Date().toISOString().split('T')[0],
      };
      
      setPendingChanges([...pendingChanges, faceChange]);
      setChangeIdCounter(changeIdCounter + 1);
      alert("✓ Face recognition re-registration request submitted for admin approval");
    } else {
      alert("✓ Face recognition registration initiated. Please follow the instructions.");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("⚠ Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("⚠ Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarChange: PendingChange = {
          id: changeIdCounter,
          field: "Profile Photo",
          oldValue: "Current Photo",
          newValue: "New Photo (pending approval)",
          status: "pending",
          requestDate: new Date().toISOString().split('T')[0],
        };
        
        setPendingChanges([...pendingChanges, avatarChange]);
        setChangeIdCounter(changeIdCounter + 1);
        alert("✓ Profile photo change submitted for admin approval");
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
            <Clock className="size-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            <CheckCircle className="size-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            <XCircle className="size-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-profile-page-container">
      <div className="profile-page-header">
        <div>
          <h1 className="profile-page-title">My Profile</h1>
          <p className="profile-page-subtitle">Manage your personal information</p>
        </div>
      </div>

      <div className="profile-page-content">
        <Card className="profile-photo-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  {editableData.avatar ? (
                    <img src={editableData.avatar} alt={userData.name} className="profile-avatar-image" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      <User className="size-12 text-white" />
                    </div>
                  )}
                </div>
                
                <label className="upload-photo-button">
                  <Camera className="size-4" />
                  <span>Change Photo</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                <p className="upload-photo-note">Requires admin approval</p>
              </div>

              <div className="flex-1">
                <h2 className="profile-user-name">{userData.name}</h2>
                <div className="profile-basic-info">
                  <div className="info-row">
                    <Shield className="info-icon" />
                    <div>
                      <p className="info-label">NIK</p>
                      <p className="info-value">{userData.nik}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <Briefcase className="info-icon" />
                    <div>
                      <p className="info-label">Position</p>
                      <p className="info-value">{editableData.position}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <User className="info-icon" />
                    <div>
                      <p className="info-label">Department</p>
                      <p className="info-value">{userData.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="personal-info-card">
          <CardContent className="p-6">
            <div className="card-header-with-action">
              <h3 className="card-section-title">Personal Information</h3>
              {!isEditingPersonal && (
                <button className="edit-button" onClick={() => setIsEditingPersonal(true)}>
                  <Edit2 className="size-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="personal-info-grid">
              <div className="info-field">
                <label className="field-label">
                  <Mail className="size-4 text-gray-500 dark:text-gray-400" />
                  Email
                </label>
                {isEditingPersonal ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{editableData.email}</p>
                )}
                <p className="field-note">Can be changed (requires approval)</p>
              </div>

              <div className="info-field">
                <label className="field-label">
                  <Phone className="size-4 text-gray-500 dark:text-gray-400" />
                  Phone Number
                </label>
                {isEditingPersonal ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{editableData.phone}</p>
                )}
                <p className="field-note">Can be changed (requires approval)</p>
              </div>

              <div className="info-field">
                <label className="field-label">
                  <Briefcase className="size-4 text-gray-500 dark:text-gray-400" />
                  Position
                </label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => handleEditFormChange('position', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{editableData.position}</p>
                )}
                <p className="field-note">Can be changed (requires approval)</p>
              </div>

              <div className="info-field">
                <label className="field-label">
                  <Calendar className="size-4 text-gray-500 dark:text-gray-400" />
                  Date of Birth
                </label>
                <p className="field-value">{new Date(userData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="field-note field-note-readonly">Read-only</p>
              </div>

              <div className="info-field info-field-full">
                <label className="field-label">
                  <MapPin className="size-4 text-gray-500 dark:text-gray-400" />
                  Address
                </label>
                <p className="field-value">{userData.address}</p>
                <p className="field-note field-note-readonly">Read-only</p>
              </div>
            </div>

            {isEditingPersonal && (
              <div className="action-buttons">
                <button className="save-button" onClick={handleSavePersonalInfo}>
                  <Save className="size-4" />
                  Submit for Approval
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  <X className="size-4" />
                  Cancel
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="security-card">
          <CardContent className="p-6">
            <h3 className="card-section-title mb-6">Security Settings</h3>

            <div className="security-section">
              <div className="security-section-header">
                <div className="flex items-center gap-3">
                  <div className="security-icon-wrapper">
                    <Lock className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="security-section-title">Change Password</h4>
                    <p className="security-section-description">Update your password regularly for security</p>
                  </div>
                </div>
                {!isEditingPassword && (
                  <button className="edit-button" onClick={() => setIsEditingPassword(true)}>
                    <Edit2 className="size-4" />
                    Change
                  </button>
                )}
              </div>

              {isEditingPassword && (
                <div className="password-form">
                  <div className="password-field">
                    <label className="field-label">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                      className="field-input"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="password-field">
                    <label className="field-label">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                      className="field-input"
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>

                  <div className="password-field">
                    <label className="field-label">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                      className="field-input"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="action-buttons">
                    <button className="save-button" onClick={handleChangePassword}>
                      <Save className="size-4" />
                      Submit for Approval
                    </button>
                    <button className="cancel-button" onClick={() => {
                      setIsEditingPassword(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}>
                      <X className="size-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="security-section">
              <div className="security-section-header">
                <div className="flex items-center gap-3">
                  <div className="security-icon-wrapper">
                    <Camera className="size-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="security-section-title">Face Recognition</h4>
                    {userData.faceRecognitionRegistered ? (
                      <p className="security-section-description">
                        Registered on {new Date(userData.faceRegistrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    ) : (
                      <p className="security-section-description">Not yet registered</p>
                    )}
                  </div>
                </div>
                <button className="edit-button" onClick={handleRequestFaceRecognition}>
                  <Camera className="size-4" />
                  {userData.faceRecognitionRegistered ? "Re-register" : "Register"}
                </button>
              </div>

              {userData.faceRecognitionRegistered && (
                <div className="face-recognition-status">
                  <AlertCircle className="size-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Face recognition can only be changed once. Re-registration requires admin approval.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {pendingChanges.length > 0 && (
          <Card className="pending-changes-card">
            <CardContent className="p-6">
              <h3 className="card-section-title mb-4">Pending Change Requests</h3>
              
              <div className="pending-changes-list">
                {pendingChanges.map((change) => (
                  <div key={change.id} className="pending-change-item">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="pending-change-field">{change.field}</h4>
                        {getStatusBadge(change.status)}
                      </div>
                      
                      <div className="pending-change-details">
                        <div>
                          <p className="change-label">From:</p>
                          <p className="change-value">{change.oldValue}</p>
                        </div>
                        <div>
                          <p className="change-label">To:</p>
                          <p className="change-value change-value-new">{change.newValue}</p>
                        </div>
                      </div>
                      
                      <p className="pending-change-date">
                        Requested on {new Date(change.requestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}