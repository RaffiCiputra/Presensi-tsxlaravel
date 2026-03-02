import { useState } from "react";
import { Outlet } from "react-router";
import { BottomNavbar } from "./BottomNavbar";

export function MainLayoutUser() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[#101828] text-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom navbar */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
