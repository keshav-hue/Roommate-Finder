import React, { useEffect, useState } from "react";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">
        💬 All Chat Messages (Admin)
      </h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-3 text-left">Sender</th>
              <th className="p-3 text-left">Receiver</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="border-b">
                <td className="p-3">{msg.sender?.name}</td>
                <td className="p-3">{msg.receiver?.name}</td>
                <td className="p-3">{msg.text}</td>
                <td className="p-3 text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <p className="p-6 text-gray-500">No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;