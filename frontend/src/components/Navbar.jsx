import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import profileIcon from "../assets/profile-icon.png";
import searchIcon from "../assets/search-icon.png";
import menuIcon from "../assets/menu-icon.png";
import logo from "../assets/logo.png";
import peopleIcon from "../assets/people-icon.png";
import notifIcon from "../assets/notif-icon.png";

import { SearchContext } from "../context/SearchContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useState(null);
  const [savedCount, setSavedCount] = useState(0);

  // 🔔 Notifications
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMessages, setNotifMessages] = useState([]);

  // ✅ Profile Created Check
  const [myProfileId, setMyProfileId] = useState(null);

  const navigate = useNavigate();

  // ✅ Search Toggle Context
  const { showSearch, setShowSearch } = useContext(SearchContext);

  /* ✅ Sync Login + Profile State */
  useEffect(() => {
    const syncAuth = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);

      const storedProfileId = localStorage.getItem("myProfileId");
      setMyProfileId(storedProfileId);
    };

    syncAuth();

    window.addEventListener("loginSuccess", syncAuth);
    window.addEventListener("profileCreated", syncAuth);
    window.addEventListener("logoutSuccess", syncAuth);

    return () => {
      window.removeEventListener("loginSuccess", syncAuth);
      window.removeEventListener("profileCreated", syncAuth);
      window.removeEventListener("logoutSuccess", syncAuth);
    };
  }, []);

  /* ✅ Logout */
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("myProfileId");

    window.dispatchEvent(new Event("logoutSuccess"));

    navigate("/login");

    setVisible(false);
    setShowNotif(false);
  };

  /* ✅ Saved Count Sync */
  useEffect(() => {
    const syncSavedCount = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setSavedCount(0);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/saved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setSavedCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.log(err);
      }
    };

    syncSavedCount();
    window.addEventListener("savedProfilesUpdated", syncSavedCount);

    return () => {
      window.removeEventListener("savedProfilesUpdated", syncSavedCount);
    };
  }, []);

  /* 🔔 Notification Sync */
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setUnreadCount(data.unreadCount || 0);
          setNotifMessages(data.messages || []);
        }
      } catch (err) {
        console.log("Notification error:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ✅ Nav Items */
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },

    ...(user && !myProfileId
      ? [{ name: "Create Profile", path: "/create" }]
      : []),
  ];

  return (
    <nav className="border-b fixed top-0 left-0 w-full bg-white z-50">
      <div className="flex items-center justify-between py-2 px-5 max-w-7xl mx-auto font-medium">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" className="w-20" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `pb-1 ${isActive ? "border-b-2 border-black" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex gap-5 items-center">
          {/* Search */}
          <img
            src={searchIcon}
            alt="search"
            className="w-6 cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          />

          {/* 🔔 Notifications ONLY if logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotif(!showNotif);
                  setVisible(false);
                }}
              >
                <img src={notifIcon} alt="notif" className="w-6 mt-1" />
              </button>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}

              {showNotif && (
                <div className="absolute right-0 mt-3 w-72 bg-white border shadow-lg rounded-xl p-4 z-50">
                  <h3 className="font-semibold mb-2 text-sm">New Messages</h3>

                  {notifMessages.length === 0 ? (
                    <p className="text-gray-500 text-sm">No unread messages</p>
                  ) : (
                    notifMessages.slice(0, 4).map((msg) => (
                      <Link
                        key={msg._id}
                        to={`/chat/${msg.senderId}`}
                        onClick={() => setShowNotif(false)}
                        className="block px-2 py-2 rounded-lg hover:bg-gray-100"
                      >
                        <p className="text-sm font-medium">{msg.senderName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {msg.text}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Saved ONLY if logged in */}
          {user && (
            <Link to="/saved" className="relative">
              <img src={peopleIcon} alt="saved" className="w-7 h-7" />
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 text-xs rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>
          )}

          {/* ✅ Login/Register if NOT logged in */}
          {!user && (
            <div className="hidden sm:flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 border rounded-lg hover:bg-black hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Profile Dropdown if logged in */}
          {user && (
            <div className="relative group hidden sm:block">
              <img src={profileIcon} alt="profile" className="w-7" />

              <div className="absolute right-0 pt-4 hidden group-hover:block">
                <div className="bg-white border shadow-lg rounded-md p-4 flex flex-col gap-2 min-w-[150px]">
                  <p className="font-semibold">{user.name}</p>

                  <Link
                    to="/myprofile"
                    className="text-gray-500 hover:text-black"
                  >
                    My Profile
                  </Link>

                  {/* Admin Dashboard */}
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-500 hover:text-black"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <p
                    onClick={logoutHandler}
                    className="cursor-pointer text-gray-500 hover:text-red-600"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <img
            src={menuIcon}
            alt="menu"
            className="w-6 cursor-pointer sm:hidden"
            onClick={() => {
              setVisible(true);
              setShowNotif(false);
            }}
          />
        </div>
      </div>

      {/* Overlay */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 w-2/3 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setVisible(false)}
            className="text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <ul className="flex flex-col items-center gap-6 mt-10 text-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `w-full text-center py-2 rounded-full transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-black hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Mobile Auth */}
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setVisible(false)}
                className="w-full text-center py-2 rounded-full border"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setVisible(false)}
                className="w-full text-center py-2 rounded-full bg-black text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/myprofile"
                onClick={() => setVisible(false)}
                className="w-full text-center py-2 rounded-full hover:bg-black hover:text-white"
              >
                My Profile
              </NavLink>

              {user?.isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setVisible(false)}
                  className="w-full text-center py-2 rounded-full hover:bg-black hover:text-white"
                >
                  Admin Dashboard
                </NavLink>
              )}

              <button
                onClick={logoutHandler}
                className="px-4 py-2 bg-red-500 text-white rounded-full"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;