import React, { useEffect, useState, useContext } from "react";
import RoommateCard from "../components/RoommateCard";
import { SearchContext } from "../context/SearchContext";
import ContactSection from "../components/ContactSection";

let cachedProfiles = null;

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [gender, setGender] = useState("All");
  const [price, setPrice] = useState("All");

  // ✅ Search Toggle State
  const { showSearch } = useContext(SearchContext);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (cachedProfiles) {
        setProfiles(cachedProfiles);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profiles`
        );

        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data
          : data.profiles || [];

        cachedProfiles = normalized;
        setProfiles(normalized);
      } catch (error) {
        console.error("❌ Fetch Profiles Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // ✅ Filter Profiles
  const filteredProfiles = Array.isArray(profiles)
    ? profiles.filter((profile) => {
        if (!profile) return false;

        const name = profile.name || "";
        const locationValue = profile.location || "";
        const genderValue = profile.gender || "";
        const rentValue = Number(profile.rent || 0);

        const matchesSearch =
          name.toLowerCase().includes(search.toLowerCase());

        const matchesLocation =
          location === "All" ||
          locationValue.toLowerCase().trim() === location.toLowerCase().trim();

        const matchesGender =
          gender === "All" || genderValue === gender;

        const matchesPrice =
          price === "All" ||
          (price === "Low" && rentValue <= 500) ||
          (price === "Medium" && rentValue > 500 && rentValue <= 600) ||
          (price === "High" && rentValue > 600);

        return (
          matchesSearch &&
          matchesLocation &&
          matchesGender &&
          matchesPrice
        );
      })
    : [];

  // ✅ Unique Locations
  const uniqueLocations = [
    "All",
    ...new Set(
      profiles
        .map((p) => p.location)
        .filter(Boolean)
        .map((loc) => loc.trim())
    ),
  ];

  if (loading) {
    return <p className="mt-20 text-center">Loading profiles...</p>;
  }

  return (
    <div className="flex flex-col items-center px-5 py-10 gap-6 max-w-7xl mx-auto">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center">
        Find Your Ideal Roommate
      </h1>

      <p className="text-gray-600 text-center max-w-xl">
        Browse listings, connect with potential roommates, and make your next
        move easier.
      </p>

      {/* ✅ Filter Section (Toggle by Search Icon) */}
      {showSearch && (
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm w-full">
          <h2 className="font-semibold mb-4">Search & Filter</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              placeholder="Search by name"
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Location */}
            <select
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Gender */}
            <select
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="All">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {/* Price */}
            <select
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="All">Any Price</option>
              <option value="Low">Below 500</option>
              <option value="Medium">500 – 600</option>
              <option value="High">Above 600</option>
            </select>
          </div>
        </div>
      )}

      {/* Profiles */}
      {filteredProfiles.length === 0 ? (
        <p className="text-gray-500 mt-10">No roommates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full">
          {filteredProfiles.map((profile) => (
            <RoommateCard key={profile._id} profile={profile} />
          ))}
        </div>
      )}

      {/* ✅ Contact Section at Bottom */}
      <ContactSection />
    </div>
  );
};

export default Home;