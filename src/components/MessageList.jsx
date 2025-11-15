// components/MessageList.jsx
// Component to display the list of messages in the chat

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MessageList.css";

const MessageList = ({ messages, onCopyMessage }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content).then(() => {
      onCopyMessage(id);
    });
  };

  return (
    <div className="message-list" role="log" aria-label="Chat messages">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏎️</div>
          <p className="empty-state-text">Start your F1 conversation! Ask about drivers, teams, circuits, or race strategies.</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role}`}
            role="article"
            aria-label={`${message.role} message`}
          >
            <div className="message-content">
              <div className="message-header">
                <span className="message-role">
                  {message.role === "user" ? "🏎️ You" : "🤖 F1 Assistant"}
                </span>
                <span className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="message-body">
                {message.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
              <button
                className="copy-button"
                onClick={() => handleCopy(message.content, message.id)}
                aria-label={`Copy ${message.role} message`}
                title="Copy message"
              >
                📋
              </button>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

