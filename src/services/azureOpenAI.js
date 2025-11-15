// services/azureOpenAI.js
// Service for interacting with Azure OpenAI API

import { AzureOpenAI } from "openai";
import config from "../config/config";

class AzureOpenAIService {
  constructor() {
    this.client = null;
    this.initializeClient();
    
    // Retry initialization after a short delay in case env vars load late
    setTimeout(() => {
      if (!this.client) {
        console.log("Retrying client initialization...");
        this.initializeClient();
      }
    }, 1000);
  }

  // Initialize the Azure OpenAI client
  initializeClient() {
    try {
      const { apiKey, endpoint, deploymentName, apiVersion } = config.azureOpenAI;

      // Debug: Log configuration (only in development, without exposing full API key)
      if (process.env.NODE_ENV === 'development') {
        console.log("=== Azure OpenAI Client Initialization ===");
        console.log("Config values received:", {
          hasApiKey: !!apiKey,
          hasEndpoint: !!endpoint,
          hasDeployment: !!deploymentName,
          endpoint: endpoint,
          deployment: deploymentName,
          apiVersion: apiVersion,
          apiKeyLength: apiKey ? apiKey.length : 0
        });
      }

      // Validate configuration
      if (!apiKey || !endpoint || !deploymentName) {
        console.error("❌ Azure OpenAI configuration is incomplete:", {
          apiKey: apiKey ? `Set (${apiKey.length} chars)` : "MISSING",
          endpoint: endpoint || "MISSING",
          deploymentName: deploymentName || "MISSING"
        });
        console.error("Please check your .env file and ensure all REACT_APP_* variables are set.");
        return;
      }

      // Normalize endpoint (remove trailing slash if present)
      const normalizedEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Creating Azure OpenAI client with:", {
          endpoint: normalizedEndpoint,
          deployment: deploymentName,
          apiVersion: apiVersion || "2024-02-15-preview"
        });
      }

      // Create client with Azure credentials
      // Note: dangerouslyAllowBrowser is required for browser environments
      // In production, consider using a backend proxy to protect your API key
      this.client = new AzureOpenAI({
        apiKey,
        endpoint: normalizedEndpoint,
        deployment: deploymentName,
        apiVersion: apiVersion || "2024-02-15-preview",
        dangerouslyAllowBrowser: true
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log("✅ Azure OpenAI client initialized successfully");
        console.log("=== End Client Initialization ===");
      }
    } catch (error) {
      console.error("❌ Failed to initialize Azure OpenAI client:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
      this.client = null;
    }
  }

  // Validate configuration before making requests
  validateConfig() {
    const { apiKey, endpoint, deploymentName } = config.azureOpenAI;
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Validating configuration...", {
        hasApiKey: !!apiKey,
        hasEndpoint: !!endpoint,
        hasDeployment: !!deploymentName,
        hasClient: !!this.client
      });
    }
    
    if (!apiKey || apiKey === "your_api_key_here") {
      throw new Error("Azure OpenAI API key is not configured. Please check your .env file and restart the server.");
    }
    
    if (!endpoint || endpoint === "https://your-resource.openai.azure.com/") {
      throw new Error("Azure OpenAI endpoint is not configured. Please check your .env file and restart the server.");
    }
    
    if (!deploymentName || deploymentName === "your_deployment_name") {
      throw new Error("Azure OpenAI deployment name is not configured. Please check your .env file and restart the server.");
    }

    if (!this.client) {
      console.error("Client is null. Configuration values:", {
        apiKey: apiKey ? "Set" : "Missing",
        endpoint: endpoint || "Missing",
        deploymentName: deploymentName || "Missing"
      });
      throw new Error("Azure OpenAI client is not initialized. Please check your configuration and restart the development server.");
    }
  }

  // Convert messages to Azure OpenAI format
  formatMessages(messages, systemPrompt = "You are a helpful assistant.") {
    const formattedMessages = [
      { role: "system", content: systemPrompt }
    ];

    // Convert user messages to Azure format
    messages.forEach((msg) => {
      if (msg.role === "user" || msg.role === "assistant") {
        formattedMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    return formattedMessages;
  }

  // Send message to Azure OpenAI
  async sendMessage(messages, systemPrompt = "You are a helpful assistant.", options = {}) {
    try {
      // Validate configuration
      this.validateConfig();

      const { maxTokens = 800, temperature = 0.7, onChunk, ...restOptions } = options;

      // Format messages for Azure OpenAI
      const formattedMessages = this.formatMessages(messages, systemPrompt);

      // Request options
      const requestOptions = {
        messages: formattedMessages,
        max_tokens: maxTokens,
        temperature,
        model: "", // Empty string for Azure OpenAI (uses deployment from client config)
        ...restOptions
      };

      // If streaming is requested
      if (onChunk) {
        requestOptions.stream = true;
        const stream = await this.client.chat.completions.create(requestOptions);

        let fullResponse = "";
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || "";
          if (delta) {
            fullResponse += delta;
            onChunk(fullResponse);
          }
        }
        return fullResponse;
      } else {
        // Non-streaming request
        const response = await this.client.chat.completions.create(requestOptions);

        const assistantMessage = response.choices[0]?.message?.content || "";
        
        if (!assistantMessage) {
          throw new Error("No response received from Azure OpenAI");
        }

        return assistantMessage;
      }
    } catch (error) {
      // Handle specific error types
      if (error.status === 401) {
        throw new Error("Invalid API key. Please check your Azure OpenAI credentials.");
      } else if (error.status === 404) {
        throw new Error("Deployment not found. Please check your deployment name.");
      } else if (error.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        throw new Error("Network error. Please check your internet connection and endpoint URL.");
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("An unexpected error occurred while communicating with Azure OpenAI.");
      }
    }
  }

  // Check if service is properly configured
  isConfigured() {
    const { apiKey, endpoint, deploymentName } = config.azureOpenAI;
    return (
      apiKey &&
      apiKey !== "your_api_key_here" &&
      endpoint &&
      endpoint !== "https://your-resource.openai.azure.com/" &&
      deploymentName &&
      deploymentName !== "your_deployment_name"
    );
  }
}

// Export singleton instance
const azureOpenAIService = new AzureOpenAIService();
export default azureOpenAIService;

