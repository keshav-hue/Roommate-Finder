import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    location: "",
    career: "",
    description: "",
    rent: "",
  });

  const [loading, setLoading] = useState(true);

  /* Fetch existing profile */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      });
  }, [id]);

  /* Handle input */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* Update profile */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Profile Updated Successfully!");
    navigate(`/profile/${id}`);
  };

  if (loading) return <p className="mt-20 text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="input"
          placeholder="Location"
        />

        <input
          name="career"
          value={form.career}
          onChange={handleChange}
          className="input"
          placeholder="Career"
        />

        <input
          name="rent"
          value={form.rent}
          onChange={handleChange}
          className="input"
          placeholder="Rent"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input"
          placeholder="Description"
        />

        <button className="w-full bg-black text-white py-3 rounded-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;