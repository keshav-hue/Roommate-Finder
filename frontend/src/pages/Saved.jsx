import { useEffect, useState } from "react";
import RoommateCard from "../components/RoommateCard";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedProfiles = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ If no token → user logged out
        if (!token) {
          setProfiles([]);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ If unauthorized → logout and redirect
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        const data = await res.json();

        // ✅ Ensure array always
        setProfiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching saved profiles:", error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProfiles();
  }, []);

  /* ✅ Loading */
  if (loading) {
    return <p className="mt-20 text-center">Loading saved profiles...</p>;
  }

  /* ✅ Not Logged In */
  if (!localStorage.getItem("token")) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-xl font-bold">You are not logged in</h2>
        <p className="text-gray-500 mt-2">
          Please login to view saved profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold mb-6">Saved Profiles</h1>

      {profiles.length === 0 ? (
        <p>No saved profiles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((p) => (
            <RoommateCard key={p._id} profile={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;