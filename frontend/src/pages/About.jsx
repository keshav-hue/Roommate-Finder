import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          About <span className="text-gray-500">Roommate Finder</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Roommate Finder is a modern platform designed to help students and
          working professionals find the perfect roommate based on lifestyle,
          preferences, and location.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">
            Verified Profiles
          </h2>
          <p className="text-gray-600">
            Every user creates a detailed profile with interests, career, and
            lifestyle information.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">
            Smart Matching
          </h2>
          <p className="text-gray-600">
            Filter roommates by location, gender, budget, and preferences with
            one click.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">
            Secure Chat
          </h2>
          <p className="text-gray-600">
            Chat directly with potential roommates safely inside the platform.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mt-20 bg-gray-100 rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Our Mission 🚀
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          Our mission is simple: make it easy, safe, and fast for anyone moving
          to a new city to find a trusted roommate and feel at home.
        </p>
      </div>
    </div>
  );
};

export default About;