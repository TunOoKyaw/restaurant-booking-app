import React, { useEffect, useState } from "react";
import { FiClock, FiCheck, FiX } from "react-icons/fi";
import { supabase } from "../utils/supabase";

import "../admin-global.css";
import "./BookingManagement.css";


const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); //ဘယ် row ကို update လုပ်နေလဲ သိစေရန် state တိုးခြင်း

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      alert("❌ ဘွတ်ကင်စာရင်းများကို ထုတ်ယူ၍မရပါ: " + error.message);
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    // မှားနှိပ်မိခြင်းမှ ကာကွယ်ရန် စစ်ဆေးခြင်း
    const textMsg =
      newStatus === "confirmed"
        ? "ဤဘွတ်ကင်ကို အတည်ပြုမှာ သေချာပါသလား?"
        : "ဤဘွတ်ကင်ကို ပယ်ဖျက်မှာ သေချာပါသလား?";
    if (!window.confirm(textMsg)) return;

    setActionLoading(id);

    const { error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("❌ အခြေအနေ ပြောင်းလဲခြင်း မအောင်မြင်ပါ: " + error.message);
    } else {
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
    }

    setActionLoading(null);
  };

  if (loading) return <div className="admin-loading">Loading Bookings...</div>;

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div className="admin-title-div">
          <h2>📅 Booking Management</h2>
          <p>စားသောက်ဆိုင် စားပွဲဝိုင်း ဘွတ်ကင်တင်ထားသမျှ စာရင်းများ</p>
        </div>
        <button
          className="refresh button"
          onClick={fetchBookings}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Guests</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  ဘွတ်ကင် စာရင်းမရှိသေးပါဗျာ။
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{booking.name}</span>
                      <span className="customer-email">{booking.email}</span>
                    </div>
                  </td>
                  <td>{booking.phone}</td>
                  <td>
                    <span className="badge-guests">{booking.guests} Pax</span>
                  </td>
                  <td>
                    <div className="booking-datetime">
                      <span>{booking.reservation_date}</span>
                      <span className="booking-time">
                        <FiClock /> {booking.reservation_time}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${booking.status || "pending"}`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {(booking.status === "pending" || !booking.status) && (
                        <>
                          <button
                            className="action-btn btn-confirm"
                            onClick={() =>
                              handleUpdateStatus(booking.id, "confirmed")
                            }
                            disabled={actionLoading === booking.id}
                            style={{
                              opacity: actionLoading === booking.id ? 0.5 : 1,
                              cursor:
                                actionLoading === booking.id
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            title="Confirm"
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="action-btn btn-cancel"
                            onClick={() =>
                              handleUpdateStatus(booking.id, "cancelled")
                            }
                            disabled={actionLoading === booking.id}
                            style={{
                              opacity: actionLoading === booking.id ? 0.5 : 1,
                              cursor:
                                actionLoading === booking.id
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            title="Cancel"
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <span
                          className="text-success"
                          style={{ fontWeight: "bold", color: "#2ecc71" }}
                        >
                          Done ✅
                        </span>
                      )}
                      {booking.status === "cancelled" && (
                        <span
                          className="text-danger"
                          style={{fontSize:"0.75rem", fontWeight: "bold", color: "#e74c3c" }}
                        >
                          Cancelled ❌
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
