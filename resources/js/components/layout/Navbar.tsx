import { Bell, Menu, User, Globe } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="navbar-container">
      {/* Mobile Menu */}
      <Button
        variant="ghost"
        size="sm"
        className="navbar-mobile-menu"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      {/* Title */}
      <div className="navbar-title-section">
        <h2 className="navbar-welcome-text">Welcome back, John Doe</h2>
        <p className="navbar-date-text">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Right Section */}
      <div className="navbar-actions">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="navbar-icon-button">
              <Globe className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="navbar-dropdown-menu">
            <DropdownMenuItem className="navbar-language-item">
              <span className="navbar-language-flag">🇺🇸</span> English
            </DropdownMenuItem>
            <DropdownMenuItem className="navbar-language-item">
              <span className="navbar-language-flag">🇮🇩</span> Indonesia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="navbar-icon-button">
              <Bell className="size-5" />
              <Badge className="navbar-notification-badge">3</Badge>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="navbar-dropdown-menu navbar-notification-dropdown"
          >
            <DropdownMenuLabel className="navbar-dropdown-label">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="navbar-dropdown-separator" />

            <div className="navbar-notification-list">
              <DropdownMenuItem className="navbar-notification-item">
                <p className="navbar-notification-title">
                  New attendance recorded
                </p>
                <p className="navbar-notification-time">
                  Alice Johnson checked in - 2 min ago
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem className="navbar-notification-item">
                <p className="navbar-notification-title">
                  Late arrival detected
                </p>
                <p className="navbar-notification-time">
                  Bob Smith arrived late - 15 min ago
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem className="navbar-notification-item">
                <p className="navbar-notification-title">
                  Cash flow updated
                </p>
                <p className="navbar-notification-time">
                  New transaction added - 1 hour ago
                </p>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="navbar-user-button">
              <div className="navbar-user-avatar">
                <User className="size-4" />
              </div>

              <div className="navbar-user-info">
                <span className="navbar-user-name">John Doe</span>
                <Badge variant="secondary" className="navbar-user-role">
                  Admin
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="navbar-dropdown-menu"
          >
            <DropdownMenuLabel className="navbar-dropdown-label">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="navbar-dropdown-separator" />

            <DropdownMenuItem
              className="navbar-dropdown-item"
              onClick={() => navigate("/profile")}
            >
              <User className="size-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator className="navbar-dropdown-separator" />

            <DropdownMenuItem
              className="navbar-dropdown-item destructive"
              onClick={() => navigate("/login")}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
