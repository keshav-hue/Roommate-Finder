import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard 👑
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-gray-500">Total Users</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-gray-500">Total Profiles</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalProfiles}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-gray-500">Total Messages</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalMessages}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;