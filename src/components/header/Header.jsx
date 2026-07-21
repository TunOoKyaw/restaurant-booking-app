import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { navLinks } from "../../Data";
import Scrolllink from "../link/Scrolllink";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { FiLogIn, FiLogOut, FiSettings } from "react-icons/fi";
import { Link, animateScroll } from "react-scroll";
import { Link as RouterLink } from "react-router-dom"; //  Router အတွက် Link ကို နာမည်လွှဲသွင်း
import { supabase } from "../../utils/supabase";

// AuthModal
import AuthModal from "../auth/AuthModal";

import "./header.css";

const Header = () => {
  const [scrollNav, setScrollNav] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Admin ဟုတ်မဟုတ် မှတ်မည့် State
  const [showAuthModal, setShowAuthModal] = useState(false);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  const scrollTop = () => {
    animateScroll.scrollToTop();
  };

  //Admin Role ရှိမရှိ profiles table မှာ စစ်ဆေးပေးမည့် Function
  const checkAdminRole = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!error && data?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);

    //Session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminRole(currentUser); // Admin စစ်မယ်
    });

    // Auth condition
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminRole(currentUser); // Admin စစ်မယ်
    });

    return () => {
      window.removeEventListener("scroll", changeNav);
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthClick = async () => {
    if (user) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("❌ Logout Fail: " + error.message);
      } else {
        alert("👋 Logout Successful!");
      }
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className={`${scrollNav ? "scroll-header" : ""} header`}>
        <nav className="nav container">
          <Link to="/" onClick={scrollTop} className="nav-logo">
            <img src={logo} alt="logo" className="nav-logo-img" />
          </Link>

          <div className={`${showMenu ? "show-menu" : ""} nav-menu`}>
            <ul className="nav-list">
              {isAdmin && (
                <li className="nav-item mobile-admin-link">
                  <RouterLink
                    to="/admin"
                    className="nav-link"
                    onClick={() => setShowMenu(false)}
                    style={{ color: "#3498db", fontWeight: "bold" }}
                  >
                    <FiSettings style={{ marginRight: "8px" }} /> Dashboard
                  </RouterLink>
                </li>
              )}
              {navLinks.map((navLink, index) => {
                return (
                  <li className="nav-item" key={index}>
                    <Scrolllink
                      to={navLink}
                      name={navLink}
                      extraProps={{ spy: true }}
                      className="nav-link"
                      onClick={() => setShowMenu(false)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="nav-buttons">
            {isAdmin && (
              <RouterLink
                to="/admin"
                className="button admin-nav-btn"
                style={{ background: "#3498db" }}
              >
                <FiSettings className="button-icon" /> Dashboard
              </RouterLink>
            )}

            <Scrolllink
              to="reservation"
              name="Book Now"
              extraProps={{ offset: -150 }}
              className="button"
              icon={<IoIosArrowDroprightCircle className="button-icon" />}
            />

            <button className="nav-auth-btn" onClick={handleAuthClick}>
              {user ? (
                <FiLogOut className="nav-auth-icon" title="Logout" />
              ) : (
                <FiLogIn className="nav-auth-icon" title="Login" />
              )}
            </button>

            <IoMenu
              onClick={() => setShowMenu(!showMenu)}
              className="nav-toggler"
            />
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
