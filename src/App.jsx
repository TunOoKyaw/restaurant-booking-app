import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase";

// Landing Page Components
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Features from "./components/features/Features";
import Menu from "./components/menu/Menu";
import Gallery from "./components/gallery/Gallery";
import Reviews from "./components/reviews/Reviews";

import Reservation from "./components/reservation/Reservation";
import Footer from "./components/footer/Footer";

// Dashboard Components
import AdminDashboard from "./admin/AdminDashboard";

import "./App.css";

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile && profile.role === "admin") {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };
    
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#fff", background: "#111" }}>
        Checking permissions...
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

const LandingPage = () => (
  <>
    <Header />
    <Home />
    <Reservation />
    <About />
    <Features />
    <Menu />
    <Gallery />
    <Reviews />
    <Footer />
  </>
);

const App = () => {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("menu_items").select("*").limit(1);
      if (error) console.log("❌ Supabase Error:", error.message);
      else console.log("✅ Supabase Connected:", data);
    }
    testConnection();
  }, []);

  return (
    <Router>
      <Routes>
        {/* ရိုးရိုး URL ဆိုရင် Landing Page ပြမယ် */}
        <Route path="/" element={<LandingPage />} />

        {/* ⭐ /admin သို့သွားရာတွင် လုံခြုံရေးအတားအဆီး ညှပ်ထားခြင်း */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;