import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RoommateCard = ({ profile }) => {
  const [isSaved, setIsSaved] = useState(false);

  // ✅ Load saved state from backend
  useEffect(() => {
    const checkSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/saved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setIsSaved(data.some((p) => p._id === profile._id));
        }
      } catch (err) {
        console.log("Error checking saved:", err);
      }
    };

    checkSaved();
  }, [profile._id]);

  // ✅ Toggle Save
  const toggleSaveProfile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to save profiles!");
      return;
    }

    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/save/${profile._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI instantly
      setIsSaved(!isSaved);

      // Refresh Navbar count
      window.dispatchEvent(new Event("savedProfilesUpdated"));
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  return (
    <div className="relative border rounded-xl p-4 shadow-sm hover:shadow-md transition">

      {/* ❤️ Save Button */}
      <button
        onClick={toggleSaveProfile}
        className="absolute top-3 right-3 text-xl z-10"
      >
        {isSaved ? "❤️" : "🤍"}
      </button>

      {/* ✅ Profile Image */}
      {profile.images?.length > 0 ? (
        <img
          src={profile.images[0]}
          alt={profile.name}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold">
          {profile.name?.[0]}
        </div>
      )}

      {/* ✅ Basic Info */}
      <h3 className="text-lg font-semibold">
        {profile.name}, {profile.age}
      </h3>

      <p className="text-sm text-gray-500">{profile.location}</p>

      {/* ✅ Career */}
      {profile.career && (
        <p className="text-sm mt-1">{profile.career}</p>
      )}

      {/* ✅ Rent Info */}
      {profile.rent && (
        <p className="mt-2 font-medium">
          {profile.currency} {profile.rent}/{profile.rentPeriod}
        </p>
      )}

      {/* ✅ Tags */}
      {profile.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ✅ View Profile Button */}
      <Link to={`/profile/${profile._id}`}>
        <button className="mt-4 w-full bg-black text-white py-2 rounded-lg">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default RoommateCard;