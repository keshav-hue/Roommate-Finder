import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ REAL SEND MESSAGE FUNCTION
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

      if (res.ok) {
        alert("✅ Message sent successfully to your email!");
        setForm({ name: "", email: "", message: "" });
      } else {
        alert(data.message || "❌ Failed to send message");
      }
    } catch (error) {
      console.error("❌ Contact Error:", error);
      alert("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Contact <span className="text-gray-500">Us</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Have questions, feedback, or need support?  
          We’d love to hear from you.
        </p>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Get in Touch 📩
          </h2>

          <p className="text-gray-600 mb-6">
            Reach out anytime — our team will respond quickly.
          </p>

          <div className="space-y-4 text-gray-700">
            <p>
               <span className="font-semibold"></span>
            </p>
            <p>
               <span className="font-semibold"></span>{" "}
              
            </p>
            <p>
               <span className="font-semibold"></span>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-8 space-y-5"
        >
          <h2 className="text-2xl font-semibold">
            Send a Message ✨
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            name="message"
            placeholder="Your Message..."
            value={form.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          ></textarea>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;