// App.jsx
// Main application component

import React, { useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import backgroundImage from "./assets/f1-bg.jpg";
import "./App.css";

function App() {
  useEffect(() => {
    // Set background on both html and body to ensure visibility
    const html = document.documentElement;
    const body = document.body;
    
    html.style.backgroundImage = `url(${backgroundImage})`;
    html.style.backgroundSize = "cover";
    html.style.backgroundPosition = "center center";
    html.style.backgroundRepeat = "no-repeat";
    html.style.backgroundAttachment = "fixed";
    html.style.minHeight = "100%";
    
    body.style.backgroundImage = `url(${backgroundImage})`;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundColor = "#0a0a0a"; // Fallback color
    
    return () => {
      html.style.backgroundImage = "";
      html.style.backgroundSize = "";
      html.style.backgroundPosition = "";
      html.style.backgroundRepeat = "";
      html.style.backgroundAttachment = "";
      html.style.minHeight = "";
      
      body.style.backgroundImage = "";
      body.style.backgroundSize = "";
      body.style.backgroundPosition = "";
      body.style.backgroundRepeat = "";
      body.style.backgroundAttachment = "";
      body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="App">
      <ChatWindow />
    </div>
  );
}

export default App;

