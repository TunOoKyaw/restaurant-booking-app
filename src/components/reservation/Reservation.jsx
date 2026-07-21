import React, { useState } from "react";
import {
  FaRegUser,
  FaPhone,
  FaUserGroup,
  FaCalendarDays,
  FaClock,
  FaCircleArrowRight,
} from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./reservation.css";

import { supabase } from "../../utils/supabase";
import AuthModal from "../auth/AuthModal"; // ⭐ AuthModal ကို လှမ်း Import လုပ်ခြင်း (လမ်းကြောင်း သတိထားပါ)

const optionsGuest = [
  { value: "", label: "Choose Guest" },
  { value: "1", label: "01" },
  { value: "2", label: "02" },
  { value: "3", label: "03" },
  { value: "4", label: "04" },
  { value: "5", label: "05" },
];

const optionsTiming = [
  { value: "", label: "Choose Time" },
  { value: "1", label: "08:00 AM - 10:00 AM" },
  { value: "2", label: "09:30 AM - 11:30 AM" },
  { value: "3", label: "10:00 AM - 12:00 PM" },
  { value: "4", label: "11:30 AM - 01:30 PM" },
  { value: "5", label: "12:00 PM - 02:00 PM" },
  { value: "6", label: "01:30 PM - 03:30 PM" },
  { value: "7", label: "03:30 PM - 05:30 PM" },
  { value: "8", label: "04:00 PM - 06:00 PM" },
  { value: "9", label: "05:30 PM - 07:30 PM" },
];

const customStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "0.75rem 0 0.75rem 3rem",
  }),
  control: () => ({
    display: "flex",
  }),
  input: (provided) => ({
    ...provided,
    padding: 0,
    margin: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "var(--first-color)" : "var(--title-color)",
    backgroundColor: state.isFocused ? "var(--container-color)" : "transparent",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "var(--text-color)",
    transform: state.isFocused ? "rotate(-180deg)" : "rotate(0)",
    transition: "transform 0.5s",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "210px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--first-color) transparent",
  }),
};

const Reservation = () => {
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(optionsGuest[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedTiming, setSelectedTiming] = useState(optionsTiming[0]);
  const [loading, setLoading] = useState(false);

  // ⭐ Auth Modal ထိန်းချုပ်ရန် State
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ၁။ 🔐 အရင်ဆုံး အကောင့်ဝင်ထားခြင်း ရှိ၊ မရှိ စစ်ဆေးခြင်း
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("⚠️ ဘွတ်ကင်လုပ်ရန် အရင်ဆုံး အကောင့်ဝင်ပေးပါခဗျာ။");
      setShowAuthModal(true);
      return;
    }

    // ၂။ Form Validation စစ်ဆေးခြင်း
    if (
      !name ||
      !email ||
      !phone ||
      !selectedGuest.value ||
      !selectedTiming.value
    ) {
      alert("ကျေးဇူးပြု၍ အချက်အလက်များ အပြည့်အစုံဖြည့်ပေးပါဦး။");
      return;
    }

    setLoading(true);
    const formattedDate = startDate.toISOString().split("T")[0];

    // ၃။ Database ထဲသို့ ဒေတာသွင်းခြင်း (user_id ကိုပါ ပူးတွဲသယ်ဆောင်သွားမည်)
    const { data, error } = await supabase.from("reservations").insert([
      {
        name: name,
        email: email,
        phone: phone,
        guests: parseInt(selectedGuest.value),
        reservation_date: formattedDate,
        reservation_time: selectedTiming.label,
        user_id: user.id, //  RLS ပေါ်လစီ အလုပ်လုပ်ရန် လက်ရှိ User ရဲ့ ID ကို ထည့်သွင်းခြင်း
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Booking fail! Plz try again. (" + error.message + ")");
    } else {
      alert("✅ Book Successfully. Thanks!");
      setName("");
      setEmail("");
      setPhone("");
      setSelectedGuest(optionsGuest[0]);
      setStartDate(new Date());
      setSelectedTiming(optionsTiming[0]);
    }
  };

  return (
    <>
      <section className="reservation reservation-container container">
        <form onSubmit={handleSubmit} className="reservation-form grid">
          <div className="reservation-group grid">
            <h3 className="reservation-title">Book Your Table</h3>

            <div className="reservation-div">
              <FaRegUser className="reservation-icon" />
              <input
                type="text"
                placeholder="Enter Name"
                className="reservation-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="reservation-div">
              <FaEnvelope className="reservation-icon" />
              <input
                type="email"
                placeholder="Enter Email"
                className="reservation-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="reservation-div">
              <FaPhone className="reservation-icon" />
              <input
                type="tel"
                placeholder="Enter Phone"
                className="reservation-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="reservation-group grid">
            <div className="reservation-div">
              <FaUserGroup className="reservation-icon" />
              <Select
                options={optionsGuest}
                styles={customStyles}
                value={selectedGuest}
                onChange={(choice) => setSelectedGuest(choice)}
              />
            </div>

            <div className="reservation-div">
              <FaCalendarDays className="reservation-icon" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="reservation-input"
              />
            </div>

            <div className="reservation-div">
              <FaClock className="reservation-icon" />
              <Select
                options={optionsTiming}
                styles={customStyles}
                value={selectedTiming}
                onChange={(choice) => setSelectedTiming(choice)}
              />
            </div>
            <button
              type="submit"
              className="button reservation-button"
              disabled={loading}
            >
              {loading ? "Processing..." : "Book Now"}{" "}
              <FaCircleArrowRight className="button-icon" />
            </button>
          </div>
        </form>

      </section>
      {/* ⭐ တကယ်လို့ Login မဝင်ရသေးရင် ပေါ်လာမည့် Auth Modal */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
    </>
  );
};

export default Reservation;
