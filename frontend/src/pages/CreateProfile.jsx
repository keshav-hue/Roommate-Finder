import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    location: "",
    career: "",
    description: "",
    tags: "",

    // ✅ Added Rent Fields
    rent: "",
    currency: "INR",
    rentPeriod: "month",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Submit Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Get Token
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first!");
        setLoading(false);
        return;
      }

      // ✅ Step 1: Create Profile
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/profiles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const profile = await res.json();

      if (!res.ok) {
        alert(profile.message || "Profile creation failed");
        setLoading(false);
        return;
      }

      console.log("✅ Profile Created:", profile);

      // ✅ Step 2: Upload Images
      for (const img of images) {
        const data = new FormData();
        data.append("image", img);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile._id}/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: data,
          }
        );

        if (!uploadRes.ok) {
          console.log("❌ Image upload failed");
        }
      }

      // ✅ Step 3: Save Profile ID
      localStorage.setItem("myProfileId", profile._id);

      // ✅ Notify Navbar instantly
      window.dispatchEvent(new Event("profileCreated"));

      alert("✅ Profile Created Successfully!");

      // ✅ Redirect
      navigate("/myprofile");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold mb-6">Create Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Age */}
        <input
          name="age"
          placeholder="Age"
          type="number"
          className="input"
          value={form.age}
          onChange={handleChange}
          required
        />

        {/* Location */}
        <input
          name="location"
          placeholder="Location"
          className="input"
          value={form.location}
          onChange={handleChange}
          required
        />

        {/* Career */}
        <input
          name="career"
          placeholder="Career"
          className="input"
          value={form.career}
          onChange={handleChange}
        />

        {/* ✅ Rent */}
        <input
          name="rent"
          placeholder="Rent Amount"
          type="number"
          className="input"
          value={form.rent}
          onChange={handleChange}
          required
        />

        {/* ✅ Currency */}
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="input"
        >
          <option value="INR">INR ₹</option>
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
        </select>

        {/* ✅ Rent Period */}
        <select
          name="rentPeriod"
          value={form.rentPeriod}
          onChange={handleChange}
          className="input"
        >
          <option value="month">Per Month</option>
          <option value="week">Per Week</option>
          <option value="day">Per Day</option>
        </select>

        {/* Tags */}
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="input"
          value={form.tags}
          onChange={handleChange}
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={handleChange}
        />

        {/* Upload Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;