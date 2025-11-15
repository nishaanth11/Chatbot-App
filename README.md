# React Chatbot with Azure OpenAI Integration

A modern, feature-rich React chatbot application that integrates with Azure OpenAI API. Built with React hooks, featuring a clean UI, message history, typing indicators, and comprehensive error handling.

## Features

- 💬 **Modern Chat Interface** - Clean, user-friendly UI with message bubbles
- 🤖 **Azure OpenAI Integration** - Seamless integration with Azure OpenAI API
- 📝 **Message History** - Maintains conversation context during the session
- 💾 **Local Storage** - Persists chat history between sessions
- 📋 **Copy Messages** - Easy copy-to-clipboard functionality
- 🔄 **Regenerate Responses** - Regenerate the last assistant response
- 💾 **Export Chat** - Export chat history as JSON
- 🗑️ **Clear Chat** - Clear conversation history
- ⌨️ **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Markdown Support** - Code blocks and formatting in responses
- ⚠️ **Error Handling** - Comprehensive error handling with user-friendly messages
- ♿ **Accessible** - ARIA labels and keyboard navigation support

## Project Structure

```
chatbot-app/
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx      # Main chat window component
│   │   ├── ChatWindow.css
│   │   ├── MessageList.jsx     # Message display component
│   │   ├── MessageList.css
│   │   ├── InputArea.jsx       # Input field component
│   │   ├── InputArea.css
│   │   ├── TypingIndicator.jsx # Typing animation
│   │   └── TypingIndicator.css
│   ├── services/
│   │   └── azureOpenAI.js      # Azure OpenAI service
│   ├── config/
│   │   └── config.js           # Configuration file
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   ├── index.js                # Entry point
│   └── index.css
├── public/
│   └── index.html
├── .env                        # Environment variables (create this)
├── .env.example                # Example environment file
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Azure OpenAI

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Azure OpenAI credentials:
   ```env
   REACT_APP_AZURE_OPENAI_KEY=your_api_key_here
   REACT_APP_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   REACT_APP_AZURE_OPENAI_DEPLOYMENT=your_deployment_name
   REACT_APP_AZURE_OPENAI_API_VERSION=2024-02-15-preview
   ```

   **Important:** 
   - Replace `your_api_key_here` with your actual Azure OpenAI API key
   - Replace `https://your-resource.openai.azure.com/` with your actual endpoint URL
   - Replace `your_deployment_name` with your deployment name
   - The API version can be adjusted if needed

### 3. Run the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_AZURE_OPENAI_KEY` | Your Azure OpenAI API key | Yes |
| `REACT_APP_AZURE_OPENAI_ENDPOINT` | Your Azure OpenAI endpoint URL | Yes |
| `REACT_APP_AZURE_OPENAI_DEPLOYMENT` | Your deployment name | Yes |
| `REACT_APP_AZURE_OPENAI_API_VERSION` | API version (default: 2024-02-15-preview) | No |

## Usage

1. **Sending Messages**: Type your message in the input field and press Enter or click the send button
2. **New Lines**: Press Shift+Enter to add a new line in your message
3. **Copy Messages**: Hover over a message and click the copy button (📋)
4. **Regenerate**: Click the "Regenerate" button to regenerate the last assistant response
5. **Export Chat**: Click "Export" to download your chat history as JSON
6. **Clear Chat**: Click "Clear" to remove all messages (with confirmation)

## Error Handling

The application handles various error scenarios:

- **Configuration Errors**: Validates that all required environment variables are set
- **API Errors**: Handles authentication, rate limiting, and network errors
- **User-Friendly Messages**: Displays clear error messages to help users understand issues

## Security Notes

- ⚠️ **Never commit the `.env` file** to version control
- ⚠️ **Never hardcode credentials** in your code
- ⚠️ **Use environment variables** for all sensitive information
- ⚠️ **Set up CORS** properly if hosting on a different domain

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder. Remember to set environment variables in your deployment platform.

## Technologies Used

- **React** - UI framework
- **@azure/openai** - Azure OpenAI SDK
- **react-markdown** - Markdown rendering for responses
- **react-syntax-highlighter** - Code syntax highlighting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

