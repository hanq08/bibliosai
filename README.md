# BibliosAI - Intelligent RAG Platform

<p align="center">
  <img src="docs/images/logo.png" alt="BibliosAI Logo" width="200"/>
</p>

BibliosAI is a Retrieval-Augmented Generation (RAG) platform that connects to various data sources like Gmail, Slack, and more, allowing users to query their data using natural language and perform actions with AI assistance.

## 🌟 Features

- **Multi-source Integration**: Connect to Gmail, Slack, Google Drive, and other data sources
- **Open Source**: Extensible data sources that are community driven
- **Contextual AI Responses**: Get answers based on your connected data sources
- **Actionable AI**: Perform tasks like sending emails or scheduling meetings with user approval
- **Secure Authentication**: OAuth integration for secure access to third-party services
- **Conversation Memory**: Keep track of conversation history for better context

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB
- Vector database (Pinecone, Chroma, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bibliosai.git
   cd bibliosai
   ```

2. Set up the backend:
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

4. Start the application:
   ```bash
   # Start the backend (from project root)
   python run.py
   
   # Start the frontend (in another terminal)
   cd frontend
   npm start
   ```

5. Open your browser and navigate to http://localhost:3000

## 📚 Documentation

- [Installation Guide](docs/installation.md): Detailed installation instructions
- [Architecture Overview](docs/architecture.md): System architecture and components
- [API Documentation](docs/api.md): API endpoints and usage
- [User Guide](docs/user_guide.md): How to use BibliosAI

## 🏗️ Architecture

BibliosAI follows a modern microservices architecture:

- **Frontend**: React-based user interface
- **Backend API**: FastAPI server handling requests and orchestrating services
- **Auth Service**: Manages authentication and authorization
- **Connector Service**: Handles integration with external data sources
- **Embedding Service**: Processes and embeds documents for retrieval
- **Vector Database**: Stores and retrieves document embeddings
- **Action Service**: Handles actionable tasks with user approval flow

## 📁 Project Structure

```
bibliosai/
├── backend/               # Backend FastAPI application
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication logic
│   ├── connectors/        # Source connectors (Gmail, Slack, etc.)
│   ├── embedding/         # Document processing and embedding
│   ├── actions/           # Actionable tasks implementation
│   └── utils/             # Utility functions
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   └── src/               # React source code
├── docs/                  # Documentation
└── scripts/               # Utility scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or support, please open an issue or contact the maintainers.

---

<p align="center">
  Made with ❤️ by the BibliosAI Team
</p>
