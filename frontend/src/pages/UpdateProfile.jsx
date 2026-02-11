import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    age: "",
    location: "",
    career: "",
    description: "",
    tags: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Load existing profile from backend (NOT localStorage ID)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          alert("Please login first!");
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profiles/myprofile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to load profile");
          setLoading(false);
          return;
        }

        // Fill form
        setForm({
          name: data.name || "",
          age: data.age || "",
          location: data.location || "",
          career: data.career || "",
          description: data.description || "",
          tags: data.tags ? data.tags.join(", ") : "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // Handle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/profiles/myprofile/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            tags: form.tags,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("✅ Profile Updated Successfully!");
      navigate("/myprofile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="mt-20 text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          className="input"
          value={form.age}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="input"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="career"
          placeholder="Career"
          className="input"
          value={form.career}
          onChange={handleChange}
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="input"
          value={form.tags}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={handleChange}
        />

        <button className="w-full bg-black text-white py-3 rounded-lg">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;