import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoClose } from "react-icons/io5";
import { supabase } from "../../utils/supabase"; // မင်းရဲ့ supabase.js လမ်းကြောင်းအတိုင်း ပြင်ပေးပါ

// Swiper Styles တွေကို Import လုပ်ရပါမယ်
import "swiper/css";
import "./authModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [swiperRef, setSwiperRef] = useState(null);

  // --- Form States များ သတ်မှတ်ခြင်း ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  // Loading နဲ့ Error ပြဖို့ State
  const [loading, setLoading] = useState(false);

  // Modal ပိတ်ထားရင် ဘာမှမပြအောင် လုပ်တာ
  if (!isOpen) return null;

  // Sign Up slide သို့ ရွှေ့ရန်
  const goToSignUp = () => {
    if (swiperRef) swiperRef.slideTo(1);
  };

  // Login slide သို့ ရွှေ့ရန်
  const goToLogin = () => {
    if (swiperRef) swiperRef.slideTo(0);
  };

  // ================= LOGIN PROCESS =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setLoading(false);

    if (error) {
      alert("❌ Login fail: " + error.message);
    } else {
      alert("✅ Login successful!");
      onClose();
    }
  };

  // ================= SIGN UP PROCESS =================
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Password တူမတူ အရင်စစ်မယ်
    if (signUpPassword !== signUpConfirmPassword) {
      alert("❌ Password and Confirm Password not same!");
      return;
    }

    setLoading(true);

    // Supabase Auth ထဲကို လှမ်းပို့မယ် (options ထဲမှာ full_name ကို user_metadata အနေနဲ့ ထည့်ပေးရပါတယ်)
    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: {
          full_name: signUpName, 
        },
      },
    });

    setLoading(false);

    if (error) {
      alert("❌ Account create fail: " + error.message);
    } else {
      alert("✅ Account create successful!");
      goToLogin(); // အကောင့်ဖွင့်ပြီးရင် Login Slide ဘက်ကို ပြန်ရွှေ့ပေးမယ်
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        {/* ပိတ်တဲ့ခလုတ် */}
        <button className="auth-close-btn" onClick={onClose} disabled={loading}>
          <IoClose />
        </button>

        {/* Swiper Slider စတင်ခြင်း */}
        <Swiper
          onSwiper={setSwiperRef}
          allowTouchMove={false} // User don't allow hand swipe
          speed={500}
          className="auth-swiper"
        >
          {/* SLIDE 1: LOGIN FORM */}
          <SwiperSlide>
            <div className="auth-form-wrapper">
              <h2>Welcome Back</h2>
              <p>Please login to your account</p>

              <form onSubmit={handleLogin} className="auth-form">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? "Processing..." : "Login"}
                </button>
              </form>

              <div className="auth-switch">
                Don't have an account?&nbsp;&nbsp;
                <span onClick={goToSignUp}>Sign Up</span>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 2: SIGN UP FORM */}
          <SwiperSlide>
            <div className="auth-form-wrapper">
              <h2>Create Account</h2>
              <p>Sign up to get started</p>

              <form onSubmit={handleSignUp} className="auth-form">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  required 
                />
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? "Processing..." : "Sign Up"}
                </button>
              </form>

              <div className="auth-switch">
                Have an account?&nbsp;&nbsp;
                <span onClick={goToLogin}>Login</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default AuthModal;