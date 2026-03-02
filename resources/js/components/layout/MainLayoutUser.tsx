import { useState } from "react";
import { Outlet } from "react-router";
import { BottomNavbar } from "./BottomNavbar";

export function MainLayoutUser() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="user-layout-root">
      <div className="user-layout-content">
        <Outlet />
      </div>

      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
