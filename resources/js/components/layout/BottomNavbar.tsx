import { Home, Clock, DollarSign, Calendar,User } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import "../../../css/styles/theme.css";




interface BottomNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavbar({ activeTab, setActiveTab }: BottomNavbarProps) {
  const navigate = useNavigate();

 const tabs = [
  { name: "dashboard", icon: <Home className="size-5" />, path: "/user/dashboard" },
  { name: "profile", icon: <User className="size-5" />, path: "/user/profile" }, // <-- ditambahkan
  { name: "history", icon: <Clock className="size-5" />, path: "/user/riwayat-absen" },
  { name: "alur kas", icon: <DollarSign className="size-5" />, path: "/user/cash-flow" },
  { name: "kalender", icon: <Calendar className="size-5" />, path: "/user/calendar" },
];


  return (
    <div className="bottom-navbar">
      {tabs.map((tab) => (
        <Button
          key={tab.name}
          variant="ghost"
          className={`bottom-navbar-btn flex flex-col items-center text-xs px-4 py-2 transition-all duration-200 ${
            activeTab === tab.name ? "active-tab" : ""
          }`}
          onClick={() => {
            setActiveTab(tab.name);
            navigate(tab.path);
          }}
        >
          {tab.icon}
          <span className="mt-1">{tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}</span>
        </Button>
      ))}
    </div>
  );
}
