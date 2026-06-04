import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendHorizonal, Bot, User, Moon, Sun } from "lucide-react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // default dark
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "openai/gpt-3.5-turbo",
         messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...newMessages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
          ],
      },
    {
       headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API}`,
            "Content-Type": "application/json",
          },
    });
    const reply = res.data.choices[0].message.content;
      setTimeout(() => {
        setMessages([...newMessages, { text: reply, sender: "bot" }]);
        setIsTyping(false);
      }, 1000); // simulate typing delay
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }

    setInput("");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      className={`flex justify-center items-center h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-md h-[600px] flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          darkMode ? "bg-white/10 backdrop-blur-lg" : "bg-white"
        }`}
      >
        {/* Header with theme toggle */}
        <div
          className={`flex justify-between items-center px-4 py-3 font-bold ${
            darkMode
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-blue-200 text-gray-800"
          }`}
        >
          <span>NeoBot 🤖</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 rounded-full bg-white/30 hover:bg-white/50"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 p-4 overflow-y-auto space-y-3 transition-colors duration-300 ${
            darkMode ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div
                  className={`mr-2 p-2 rounded-full ${
                    darkMode ? "bg-gray-700 text-white" : "bg-gray-300"
                  }`}
                >
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : darkMode
                    ? "bg-gray-700 text-gray-200 rounded-bl-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div
                  className={`ml-2 p-2 rounded-full ${
                    darkMode ? "bg-blue-500 text-white" : "bg-blue-400 text-white"
                  }`}
                >
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className={`px-3 py-2 rounded-2xl flex space-x-1 ${
                  darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-300 text-gray-800"
                }`}
              >
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-200">●</span>
                <span className="animate-bounce delay-400">●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className={`flex items-center p-3 border-t transition-colors duration-300 ${
            darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-200 border-gray-300"
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-full outline-none transition-colors duration-300 ${
              darkMode
                ? "bg-gray-900 text-white placeholder-gray-400"
                : "bg-white text-gray-800 placeholder-gray-500"
            }`}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition"
          >
            <SendHorizonal size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
