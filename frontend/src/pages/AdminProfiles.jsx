import { useEffect, useState } from "react";

const AdminProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/profiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setProfiles(data);
    };

    fetchProfiles();
  }, []);

  const deleteProfile = async (id) => {
    if (!confirm("Delete this profile?")) return;

    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/profile/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setProfiles(profiles.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Profiles</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {profiles.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded-xl p-6"
          >
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-gray-500">{p.location}</p>

            <p className="text-sm mt-2">
              Owner: {p.user?.email}
            </p>

            <button
              onClick={() => deleteProfile(p._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfiles;