import React from "react";
import { useParams } from "react-router-dom";
import { profiles } from "../assets/assets";

const RoommateProfile = () => {
  const { id } = useParams();

  const profile = profiles.find(p => p.id === Number(id));

  if (!profile) {
    return <p className="text-center mt-10">Profile not found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold">
          {profile.name[0]}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">
            {profile.age} years • {profile.gender}
          </p>
          <p className="mt-2 text-gray-700">{profile.career}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-6 rounded-xl">
          <h2 className="font-semibold mb-2">Living Details</h2>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Residence:</strong> {profile.residence}</p>
          <p><strong>Rent:</strong> {profile.currency} {profile.rent}/{profile.rentPeriod}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-gray-700">{profile.description}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {profile.tags.map(tag => (
          <span
            key={tag}
            className="bg-gray-200 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-8 bg-black text-white px-6 py-3 rounded-lg">
        Send Roommate Request
      </button>
    </div>
  );
};

export default RoommateProfile;