import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ✅ Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ✅ Check if profile belongs to logged-in user
  const isOwner = user && profile?.user === user.id;

  /* 🔹 Fetch Profile */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${id}`
        );

        if (!res.ok) throw new Error("Profile not found");

        const data = await res.json();
        setProfile(data);

        // ✅ Sync saved state
        const saved =
          JSON.parse(localStorage.getItem("savedProfiles")) || [];
        setIsSaved(saved.includes(data._id));
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  /* ❤️ Save Profile (only if NOT owner) */
  const toggleSaveProfile = () => {
    if (!user) {
      alert("Please login to save profiles!");
      return;
    }

    let saved =
      JSON.parse(localStorage.getItem("savedProfiles")) || [];

    let updated;

    if (saved.includes(profile._id)) {
      updated = saved.filter((pid) => pid !== profile._id);
      setIsSaved(false);
    } else {
      updated = [...saved, profile._id];
      setIsSaved(true);
    }

    localStorage.setItem("savedProfiles", JSON.stringify(updated));
    window.dispatchEvent(new Event("savedProfilesUpdated"));
  };

  /* 🖼 Upload Image (only owner) */
  const handleImageUpload = async (e) => {
    if (!isOwner) return;

    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile._id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const updatedProfile = await res.json();
      setProfile(updatedProfile);

      alert("✅ Photo uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ⏳ Loading */
  if (loading) {
    return <p className="mt-20 text-center">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="mt-20 text-center">Profile not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      {/* ← Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 font-bold"
      >
        ← Back
      </button>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        {/* 🖼 Profile Image */}
        {profile.images?.length > 0 ? (
          <img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-72 object-cover"
          />
        ) : (
          <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
            No image uploaded
          </div>
        )}

        <div className="p-6 relative">
          {/* ❤️ Save Button ONLY for other users */}
          {!isOwner && (
            <button
              onClick={toggleSaveProfile}
              className="absolute top-6 right-6 text-2xl"
            >
              {isSaved ? "❤️" : "🤍"}
            </button>
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
          <h1 className="text-2xl font-bold mt-4">
            {profile.name}, {profile.age}
          </h1>

          <p className="text-gray-500 mt-1">
            {profile.gender} · {profile.location}
          </p>

          <p className="mt-2">{profile.career}</p>

          <p className="mt-4">{profile.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ✅ CHAT BUTTON (Only if viewing someone else) */}
          {!isOwner && user && (
            <button
              onClick={() => navigate(`/chat/${profile.user}`)}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              💬 Chat with {profile.name}
            </button>
          )}

          {/* ✅ Owner Update Option */}
          {isOwner && (
            <button
              onClick={() => navigate("/update-profile")}
              className="mt-6 w-full bg-black text-white py-2 rounded-lg"
            >
              Update Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;