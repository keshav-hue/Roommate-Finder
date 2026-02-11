import React, { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Submit (Send Email)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "❌ Failed to send message");
        return;
      }

      alert("✅ Message sent successfully!");

      // Reset Form
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("❌ Contact Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-100 mt-20 py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Get in Touch
          </h2>

          <p className="text-gray-600 mb-6">
            Have questions, feedback, or want help finding a roommate?  
            Send us a message and we’ll respond soon.
          </p>

          <p className="text-gray-700 font-medium">
          </p>

          <p className="text-gray-700 font-medium mt-2">
          </p>
        </div>

        {/* Right Side Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input w-full"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="input w-full h-28"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Footer Bottom */}
      <p className="text-center text-gray-500 text-sm mt-12">
        © {new Date().getFullYear()} Roommate Finder. All rights reserved.
      </p>
    </div>
  );
};

export default ContactSection;