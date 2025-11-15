// components/TypingIndicator.jsx
// Component to show typing animation while waiting for response

import React from "react";
import "./TypingIndicator.css";

const TypingIndicator = () => {
  return (
    <div className="typing-indicator" aria-label="Assistant is typing">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  );
};

export default TypingIndicator;

