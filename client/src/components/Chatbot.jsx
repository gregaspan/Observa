import React, { useState } from "react";
import axios from "axios";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userAvatar =
    user?.avatar || "https://randomuser.me/api/portraits/women/2.jpg";

  const handleInputChange = (e) => setQuestion(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (question.trim() === "") return;
    const newMessage = { type: "question", text: question };
    setMessages([...messages, newMessage]);
    setQuestion("");

    try {
      setIsLoading(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "typing", text: "loading" },
      ]);
      const res = await axios.post("http://127.0.0.1:6969/api/chat", {
        question,
      });

      const data = JSON.parse(res.data);
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const responseMessage = {
          type: "response",
          text: data.choices[0].message.content,
        };
        setMessages((prevMessages) =>
          prevMessages.slice(0, -1).concat(responseMessage)
        );
      } else {
        const errorMessage = {
          type: "error",
          text: "Unexpected response format from the API.",
        };
        setMessages((prevMessages) =>
          prevMessages.slice(0, -1).concat(errorMessage)
        );
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error communicating with the API:", error);
      const errorMessage = {
        type: "error",
        text: "Failed to fetch the answer from the server.",
      };
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat(errorMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Chat Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="pb-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Chat
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter your question below to chat with the bot.
          </p>
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col h-full bg-white shadow-md rounded-lg p-6">
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 mb-4 ${
                  msg.type === "question" ? "justify-end" : "justify-start"
                }`}
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    msg.type === "question"
                      ? userAvatar
                      : "https://static.vecteezy.com/system/resources/previews/007/786/837/original/security-guard-in-simple-flat-personal-profile-icon-or-symbol-people-concept-illustration-vector.jpg"
                  }
                  alt="Profile"
                />
                <div
                  className={`flex flex-col max-w-[320px] p-4 border-gray-200 rounded-xl ${
                    msg.type === "question"
                      ? "bg-blue-100 text-right rounded-br-none"
                      : "bg-gray-100 text-left rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900">
                      {msg.type === "question" ? "You" : "Bot"}
                    </span>
                  </div>
                  {msg.type === "typing" ? (
                    <div className="flex flex-row gap-1.5 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                    </div>
                  ) : (
                    <p className="text-sm font-normal py-2.5 text-gray-900">
                      {msg.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <input
              value={question}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter your question..."
              className="border border-gray-300 p-3 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
