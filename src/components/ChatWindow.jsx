// components/ChatWindow.jsx
// Main chat window component that orchestrates all chat functionality

import React, { useState, useEffect, useCallback } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";
import azureOpenAI from "../services/azureOpenAI";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [systemPrompt] = useState("You are an F1 racing expert and enthusiast AI assistant. You have deep knowledge of Formula 1 racing, drivers, teams, circuits, race strategies, technical regulations, and F1 history. Provide engaging, accurate, and passionate responses about all things Formula 1. Use F1 terminology naturally and share your enthusiasm for the sport.");

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatbot-messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error("Failed to load saved messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatbot-messages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("chatbot-messages");
    }
  }, [messages]);

  // Validate configuration on mount
  useEffect(() => {
    if (!azureOpenAI.isConfigured()) {
      setError("Azure OpenAI is not configured. Please check your .env file and ensure all required environment variables are set.");
    }
  }, []);

  // Handle copy message feedback
  const handleCopyMessage = useCallback((messageId) => {
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  }, []);

  // Generate unique ID for messages
  const generateId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Send message to Azure OpenAI
  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Validate configuration
    if (!azureOpenAI.isConfigured()) {
      setError("Azure OpenAI is not configured. Please check your .env file.");
      return;
    }

    // Create user message
    const userMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API (excluding system message from display)
      const apiMessages = [...messages, userMessage];

      // Call Azure OpenAI service
      const response = await azureOpenAI.sendMessage(apiMessages, systemPrompt, {
        maxTokens: 800,
        temperature: 0.7
      });

      // Create assistant message
      const assistantMessage = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      // Add assistant message to state
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
      
      // Optionally remove the user message if there was an error
      // setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, systemPrompt]);

  // Clear chat history
  const handleClearChat = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all chat history?")) {
      setMessages([]);
      setError(null);
      localStorage.removeItem("chatbot-messages");
    }
  }, []);

  // Export chat history
  const handleExportChat = useCallback(() => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [messages]);

  // Regenerate last response
  const handleRegenerate = useCallback(async () => {
    if (messages.length === 0 || isLoading) return;

    // Find the last user message
    const lastUserMessageIndex = messages.map(m => m.role).lastIndexOf("user");
    if (lastUserMessageIndex === -1) return;

    // Remove all messages after the last user message
    const messagesUpToLastUser = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesUpToLastUser);
    setError(null);
    setIsLoading(true);

    try {
      const response = await azureOpenAI.sendMessage(messagesUpToLastUser, systemPrompt, {
        maxTokens: 800,
        temperature: 0.7
      });

      const assistantMessage = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error regenerating message:", err);
      setError(err.message || "Failed to regenerate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, systemPrompt]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h1 className="chat-title">🏎️ F1 Racing Chatbot</h1>
        <div className="chat-actions">
          {messages.length > 0 && (
            <>
              <button
                className="action-button"
                onClick={handleRegenerate}
                disabled={isLoading}
                aria-label="Regenerate last response"
                title="Regenerate last response"
              >
                🔄 Regenerate
              </button>
              <button
                className="action-button"
                onClick={handleExportChat}
                disabled={messages.length === 0}
                aria-label="Export chat history"
                title="Export chat history"
              >
                💾 Export
              </button>
              <button
                className="action-button danger"
                onClick={handleClearChat}
                disabled={isLoading}
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                🗑️ Clear
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button
            className="error-close"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="chat-messages-container">
        <MessageList
          messages={messages}
          onCopyMessage={handleCopyMessage}
        />
        {isLoading && (
          <div className="typing-container">
            <TypingIndicator />
          </div>
        )}
      </div>

      <InputArea
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!azureOpenAI.isConfigured()}
      />
    </div>
  );
};

export default ChatWindow;

