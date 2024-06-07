import React, { useState } from "react";
import axios from "axios";

// Component definition for ChatApp
const ChatApp = () => {
  const [messages, setMessages] = useState([]); // State to hold all messages
  const [question, setQuestion] = useState(""); // State to hold the current input
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const user = JSON.parse(localStorage.getItem('user')); // Get user data from local storage
  const userAvatar = user?.avatar || "https://randomuser.me/api/portraits/women/2.jpg"; // Get user avatar or default

  // Handles changes to the input field
  const handleInputChange = (e) => setQuestion(e.target.value);

  // Function to submit the question
  const handleSubmit = async () => {
    if (question.trim() === "") return; // Prevent submitting empty questions
    const newMessage = { type: "question", text: question };
    setMessages([...messages, newMessage]); // Add question to message list
    setQuestion(""); // Clear the input field

    try {
      setIsLoading(true);
      setMessages((prevMessages) => [...prevMessages, { type: "typing", text: "..." }]);
      const res = await axios.post("http://127.0.0.1:6969/api/chat", { question });
      console.log("Raw API Response:", res.data);

      const data = JSON.parse(res.data); // Parse the JSON string
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const responseMessage = { type: "response", text: data.choices[0].message.content };
        setMessages((prevMessages) => prevMessages.slice(0, -1).concat(responseMessage)); // Add response to message list
      } else {
        const errorMessage = { type: "error", text: "Unexpected response format from the API." };
        setMessages((prevMessages) => prevMessages.slice(0, -1).concat(errorMessage)); // Add error message to list
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error communicating with the API:", error);
      const errorMessage = { type: "error", text: "Failed to fetch the answer from the server." };
      setMessages((prevMessages) => prevMessages.slice(0, -1).concat(errorMessage)); // Add error message to list
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden h-full">
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">Chat</h2>
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-2.5 mb-2 ${msg.type === "question" ? "justify-end" : "justify-start"}`}>
                <img className="w-8 h-8 rounded-full" src={msg.type === "question" ? userAvatar : "https://static.vecteezy.com/system/resources/previews/007/786/837/original/security-guard-in-simple-flat-personal-profile-icon-or-symbol-people-concept-illustration-vector.jpg"} alt="Profile"/>
                <div className={`flex flex-col max-w-[320px] p-4 border-gray-200 rounded-xl ${msg.type === "question" ? "bg-blue-100 text-right rounded-br-none" : msg.type === "response" ? "bg-gray-100 text-left rounded-bl-none" : "bg-gray-100 text-left rounded-bl-none"}`}>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900">{msg.type === "question" ? "You" : "Bot"}</span>
                  </div>
                  <p className="text-sm font-normal py-2.5 text-gray-900">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              value={question}
              onChange={handleInputChange}
              placeholder="Enter your question..."
              className="border p-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatApp;
