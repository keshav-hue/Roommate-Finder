import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import CreateProfile from "./pages/CreateProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";
import UpdateProfile from "./pages/UpdateProfile";
import Chat from "./pages/Chat";

import About from "./pages/About";
import Contact from "./pages/Contact";

/* ✅ Admin Pages */
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProfiles from "./pages/AdminProfiles";
import AdminMessages from "./pages/AdminMessages";

const App = () => {
  return (
    <>
      {/* Navbar Always Fixed */}
      <Navbar />

      {/* Push content below navbar */}
      <div className="pt-20">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/myprofile" element={<MyProfile />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile */}
          <Route path="/create" element={<CreateProfile />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />

          {/* Chat */}
          <Route path="/chat/:userId" element={<Chat />} />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ✅ Admin Panel Nested Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
