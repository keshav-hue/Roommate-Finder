import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logoutAdmin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen py-4 bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

        <nav className="flex flex-col gap-4 text-lg">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive ? "bg-white text-black" : "hover:bg-gray-800"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive ? "bg-white text-black" : "hover:bg-gray-800"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/profiles"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive ? "bg-white text-black" : "hover:bg-gray-800"
              }`
            }
          >
            Profiles
          </NavLink>
            <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive ? "bg-white text-black" : "hover:bg-gray-800"
              }`
            }
            >
            View All Messages
            </NavLink>
        </nav>

        <button
          onClick={logoutAdmin}
          className="mt-6 bg-red-600 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;