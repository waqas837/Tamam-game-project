import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  let isAdmin = localStorage.getItem("admin");
  useEffect(() => {
    let isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
  }, []);
  return (
    <div className={` ${isAdmin ? "h-screen bg-gray-100" : ""}`}>
      {isAdmin ? <Sidebar /> : ""}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile header - adjust this based on your Sidebar component */}
        <div className="md:hidden h-16 bg-white shadow-sm"></div>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
