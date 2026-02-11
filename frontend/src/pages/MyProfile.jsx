import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Owner check (MyProfile is always owner)
  const [isOwner] = useState(true);

  // ✅ Upload state
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch logged-in user's profile
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❌ If not logged in
        if (!token) {
          alert("Please login first!");
          navigate("/login");
          return;
        }

        // ✅ Backend Route (Correct)
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
          setProfile(null);
          setLoading(false);
          return;
        }

        // ✅ Save Profile
        setProfile(data);

        // ✅ Store ID for Navbar Create Profile Hide
        localStorage.setItem("myProfileId", data._id);
        window.dispatchEvent(new Event("profileCreated"));
      } catch (error) {
        console.error("❌ Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, [navigate]);

  // ⏳ Loading
  if (loading) {
    return <p className="mt-20 text-center">Loading profile...</p>;
  }

  // ✅ Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/profiles/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ Update profile images instantly
        setProfile((prev) => ({
          ...prev,
          images: [data.imageUrl, ...(prev.images || [])],
        }));
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setUploading(false);
    }
  };

  // ❌ No profile created yet
  if (!profile) {
    return (
      <div className="mt-20 text-center">
        <p className="text-gray-500 text-lg">
          No profile created yet.
        </p>

        <button
          onClick={() => navigate("/create")}
          className="mt-5 px-6 py-3 bg-black text-white rounded-lg"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      {/* ✅ Update Button */}
      <button
        onClick={() => navigate("/update-profile")}
        className="mb-6 px-5 py-2 bg-black text-white rounded-lg"
      >
        Update Profile
      </button>

      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      {/* ✅ Profile Image */}
      {profile.images?.length > 0 ? (
        <img
          src={profile.images[0]}
          alt="profile"
          className="w-full h-64 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
          No image uploaded
        </div>
      )}

      {/* ✅ Upload Button ONLY for owner */}
      {isOwner && (
        <label className="inline-block mt-4 cursor-pointer text-sm underline">
          {uploading ? "Uploading..." : "Upload new photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {/* Info */}
      <h2 className="text-2xl font-semibold mt-5">
        {profile.name}, {profile.age}
      </h2>

      <p className="text-gray-600 mt-1">
        {profile.gender} • {profile.location}
      </p>

      <p className="mt-3 text-lg">{profile.career}</p>

      <p className="mt-4">{profile.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-5">
        {profile.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;