import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Chat = () => {
  const { userId } = useParams();

  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  /* ✅ Fetch Messages */
  useEffect(() => {
    const loadChat = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setMessages(data);
    };

    loadChat();
  }, [userId]);

  /* ✅ Send Message */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: userId,
          text,
        }),
      }
    );

    const newMsg = await res.json();

    setMessages([...messages, newMsg]);
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-5">
        💬 Chat
      </h1>

      {/* Messages */}
      <div className="h-[400px] border rounded-lg p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-3 flex ${
              msg.sender === userId ? "justify-start" : "justify-end"
            }`}
          >
            <p className="px-4 py-2 rounded-lg bg-black text-white max-w-xs">
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;