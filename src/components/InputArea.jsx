// components/InputArea.jsx
// Component for message input and send functionality

import React, { useState, useRef, useEffect } from "react";
import "./InputArea.css";

const InputArea = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    // Allow Shift+Enter for new line, Enter alone to send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="message-input"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about F1 drivers, teams, circuits, or race strategies... (Press Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={isLoading || disabled}
          aria-label="Message input"
          aria-describedby="input-help"
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || isLoading || disabled}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            <span>➤</span>
          )}
        </button>
      </div>
      <p id="input-help" className="input-help">
        🏁 Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
};

export default InputArea;

