// config/config.js
// Configuration file for Azure OpenAI credentials
// Users should create a .env file with the required environment variables

// Get environment variables with fallback to direct values for development
const getEnvVar = (key, fallback = null) => {
  const value = process.env[key];
  if (value) return value;
  
  // Fallback: Try to get from window if available (for debugging)
  if (typeof window !== 'undefined' && window.__ENV__) {
    return window.__ENV__[key] || fallback;
  }
  
  return fallback;
};

// Debug: Log ALL process.env keys that start with REACT_APP
console.log("=== Environment Variables Debug ===");
console.log("All REACT_APP_* variables:", 
  Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((obj, key) => {
      const value = process.env[key];
      // Mask sensitive values
      if (key.includes('KEY')) {
        obj[key] = value ? value.substring(0, 10) + '...' : 'NOT SET';
      } else {
        obj[key] = value || 'NOT SET';
      }
      return obj;
    }, {})
);

// Debug: Log specific variables we're looking for
console.log("Specific Variables Check:", {
  REACT_APP_AZURE_OPENAI_KEY: process.env.REACT_APP_AZURE_OPENAI_KEY ? 
    process.env.REACT_APP_AZURE_OPENAI_KEY.substring(0, 10) + "..." : "NOT SET",
  REACT_APP_AZURE_OPENAI_ENDPOINT: process.env.REACT_APP_AZURE_OPENAI_ENDPOINT || "NOT SET",
  REACT_APP_AZURE_OPENAI_DEPLOYMENT: process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT || "NOT SET",
  REACT_APP_AZURE_OPENAI_API_VERSION: process.env.REACT_APP_AZURE_OPENAI_API_VERSION || "NOT SET"
});

const config = {
  azureOpenAI: {
    apiKey: getEnvVar('REACT_APP_AZURE_OPENAI_KEY'),
    endpoint: getEnvVar('REACT_APP_AZURE_OPENAI_ENDPOINT'),
    deploymentName: getEnvVar('REACT_APP_AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: getEnvVar('REACT_APP_AZURE_OPENAI_API_VERSION', '2024-12-01-preview')
  }
};

// Debug: Log final config (without exposing full API key)
console.log("Final Config Object:", {
  hasApiKey: !!config.azureOpenAI.apiKey,
  hasEndpoint: !!config.azureOpenAI.endpoint,
  hasDeployment: !!config.azureOpenAI.deploymentName,
  endpoint: config.azureOpenAI.endpoint,
  deployment: config.azureOpenAI.deploymentName,
  apiVersion: config.azureOpenAI.apiVersion,
  apiKeyPreview: config.azureOpenAI.apiKey ? 
    config.azureOpenAI.apiKey.substring(0, 10) + "..." : "NOT SET"
});
console.log("=== End Environment Variables Debug ===");

export default config;

