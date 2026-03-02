import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Clock, Mail, Lock, CheckCircle, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Alert, AlertDescription } from "../components/ui/alert";
import { authAPI } from "../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('🔐 Login attempt:', { email });

    try {
      const response = await authAPI.login({ email, password });

      console.log('✅ Login successful:', response.data);

      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log('💾 Saved to localStorage');

      // Route based on role
      if (user.role === "admin") {
        console.log('🔀 Redirecting to admin dashboard');
        navigate("/admin/dashboard");
      } else if (user.role === "user") {
        console.log('🔀 Redirecting to user dashboard');
        navigate("/user/dashboard");
      } else {
        setError("Invalid user role");
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      console.error('❌ Response:', err.response?.data);
      
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-modern">
      <div className="login-background">
        <div className="login-bg-shape login-bg-shape-1"></div>
        <div className="login-bg-shape login-bg-shape-2"></div>
        <div className="login-bg-shape login-bg-shape-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo-wrapper">
              <Clock className="login-logo-icon" />
            </div>
            <h1 className="login-title">AttendPro</h1>
            <p className="login-subtitle">
              Attendance & Cash Flow Management System
            </p>
          </div>

          {/* Features Grid */}
          <div className="login-features-grid">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <Clock className="icon" />
              </div>
              <span className="login-feature-text">Face Recognition</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <CheckCircle className="icon" />
              </div>
              <span className="login-feature-text">QR Code Scanner</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <Lock className="icon" />
              </div>
              <span className="login-feature-text">Cash Flow Tracking</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <LogIn className="login-form-icon" />
              <h2 className="login-form-title">Sign In</h2>
              <p className="login-form-subtitle">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="login-alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <Label htmlFor="email" className="login-label">
                  Email Address
                </Label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <Label htmlFor="password" className="login-label">
                  Password
                </Label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="toggle-icon" />
                    ) : (
                      <Eye className="toggle-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div className="login-form-options">
                <div className="login-remember">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label htmlFor="remember" className="login-remember-label">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="login-forgot">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="login-submit-icon" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="login-demo">
              <div className="login-demo-title">Demo Credentials:</div>
              <div className="login-demo-grid">
                <div className="login-demo-item">
                  <span className="login-demo-badge login-demo-badge-admin">
                    Admin
                  </span>
                  <span className="login-demo-text">
                    admin@example.com / admin123
                  </span>
                </div>
                <div className="login-demo-item">
                  <span className="login-demo-badge login-demo-badge-user">
                    User
                  </span>
                  <span className="login-demo-text">
                    alice@example.com / user123
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
