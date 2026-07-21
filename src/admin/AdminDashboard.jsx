import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FiCalendar, FiBookOpen, FiLogOut } from "react-icons/fi";

// အသစ်ခွဲထုတ်လိုက်တဲ့ ဖိုင်တွေကို ဆွဲသွင်းတာပါ
import BookingManagement from "./BookingManagement";
import MenuManagement from "./MenuManagement";

import "./adminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Dashboard မှ ထွက်လိုက်ပါပြီ။");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h3>
            Retro <span>Admin</span>
          </h3>
        </div>
        <ul className="admin-menu-list">
          <li>
            <Link to="/admin/bookings" className="admin-menu-link">
              <FiCalendar className="admin-icon" />
              <span>Booking Management</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/menu" className="admin-menu-link">
              <FiBookOpen className="admin-icon" />
              <span>Menu Management</span>
            </Link>
          </li>
        </ul>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <FiLogOut className="admin-icon" />
          <span>Exit</span>
        </button>
      </aside>

      {/* MAIN DYNAMIC CONTENT */}
      <main className="admin-main-content">
        <Routes>
          {/* Default လာရင် Bookings ကို ပြမယ် */}
          <Route path="/" element={<BookingManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="menu" element={<MenuManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
