import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [conversationId, setConversationId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const messagesEndRef = useRef(null);

  const navigate = useNavigate()
  const { logout } = useAuth();

  
  // 🔥 Load sidebar chats
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  api.chat.getConversations()
    .then(setConversations)
    .catch((err) => {
      console.log("No conversations:", err.message);
    });

}, []);
  // 🔥 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);

    setMessage("");

    try {
      const payload = {
        message: userMsg.content
      };

      if (conversationId && conversationId !== "null") {
        payload.conversationId = conversationId;
      }

      console.log("Payload:", payload);

      const res = await api.chat.sendMessage(payload);

      const aiMsg = { role: "ai", content: res.response };

      setMessages((prev) => [...prev, aiMsg]);

      if (res.conversationId) {
        setConversationId(res.conversationId);
      }

      api.chat.getConversations().then(setConversations);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 New chat reset
  const newChat = () => {
    setMessages([]);
    setConversationId(null);
    setSelectedChat(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 🔥 SIDEBAR */}
      <div style={{
        width: "260px",
        background: "#202123",
        color: "white",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between" // ✅ ADDED
      }}>
        
        {/* TOP SECTION */}
        <div>
          <button
            onClick={newChat}
            style={{
              width: "100%",
              padding: "10px",
              background: "#343541",
              color: "white",
              border: "none",
              borderRadius: "6px",
              marginBottom: "20px"
            }}
          >
            + New Chat
          </button>

          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                setMessages(chat.messages || []);
                setConversationId(chat.id);
              }}
              style={{
                padding: "10px",
                marginBottom: "8px",
                background:
                  selectedChat?.id === chat.id ? "#555" : "#171615e0",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {chat.title}
            </div>
          ))}
        </div>

        {/* ✅ LOGOUT BUTTON (ADDED) */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "10px",
            background: "#44efd2",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Logout
        </button>

      </div>

      {/* 🔥 MAIN CHAT */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#01100f",
        color: "white"
      }}>

        {/* CHAT AREA */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px"
        }}>
          {messages.length === 0 && (
            <h2 style={{ textAlign: "center", marginTop: "100px" }}>
              What can I help with?
            </h2>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  background:
                    msg.role === "user" ? "#25cdeb" : "#444654",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  maxWidth: "60%"
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT */}
        <div style={{
          padding: "15px",
          borderTop: "1px solid #555",
          display: "flex",
          gap: "10px"
        }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "10px 20px",
              background: "#39575a",
              border: "none",
              color: "white",
              borderRadius: "8px"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

