# BibliosAI Installation Guide

This guide provides step-by-step instructions for setting up and running the BibliosAI platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+**: Required for the backend
- **Node.js 18+**: Required for the frontend
- **MongoDB**: Required for storing user data and application state
- **Git**: Required for cloning the repository

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bibliosai.git
cd bibliosai
```

### 2. Set Up the Backend

#### Create a Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

#### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### Initialize Project Structure

```bash
python scripts/init_project.py
```

#### Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
# You'll need to set:
# - SECRET_KEY: A secure random string
# - OPENAI_API_KEY: Your OpenAI API key
# - Other configuration options as needed
```

### 3. Set Up the Frontend

#### Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### Configure Frontend Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
# By default, it should point to the local backend:
# REACT_APP_API_URL=http://localhost:8000
```

### 4. Set Up the Database

#### Start MongoDB

If you're using a local MongoDB installation:

```bash
# Start MongoDB service
# On Windows
net start MongoDB
# On macOS (if installed via Homebrew)
brew services start mongodb-community
# On Linux
sudo systemctl start mongod
```

Alternatively, you can use MongoDB Atlas or another cloud provider.

### 5. Run the Application

#### Start the Backend

```bash
# From the project root directory
python run.py
```

The backend API will be available at http://localhost:8000.

#### Start the Frontend

```bash
# From the frontend directory
npm start
```

The frontend will be available at http://localhost:3000.

## Verifying the Installation

1. Open your browser and navigate to http://localhost:3000
2. You should see the BibliosAI login page
3. Register a new account or log in with the default credentials:
   - Email: `user@example.com`
   - Password: `password`
4. After logging in, you should see the dashboard

## Common Issues and Troubleshooting

### Backend Issues

- **ModuleNotFoundError**: Ensure you've activated the virtual environment and installed all dependencies
- **Connection refused**: Make sure MongoDB is running
- **Permission denied**: Ensure you have the necessary permissions to access the required ports

### Frontend Issues

- **Module not found**: Make sure you've run `npm install` in the frontend directory
- **API connection error**: Ensure the backend is running and the REACT_APP_API_URL is set correctly

## Next Steps

After installation, you can:

1. Connect to your data sources (Gmail, Slack, etc.)
2. Start chatting with the AI using your connected data
3. Explore the various features of the platform

For more information, see the [User Guide](user_guide.md) and [Architecture Overview](architecture.md).

## Development Setup

For development purposes, you may want to:

1. Enable debug mode in the backend by setting `DEBUG=true` in the `.env` file
2. Use the development server for the frontend with hot reloading
3. Set up a local vector database (Chroma) by configuring `CHROMA_PERSIST_DIRECTORY` in the `.env` file

## Docker Setup (Optional)

For a containerized setup, you can use Docker:

```bash
# Build and start the containers
docker-compose up -d

# Stop the containers
docker-compose down
```

The Docker setup includes:
- Backend API container
- Frontend container
- MongoDB container
- Vector database container

## Production Deployment

For production deployment, additional steps are recommended:

1. Use a production-ready web server (e.g., Nginx)
2. Set up SSL certificates for HTTPS
3. Configure proper authentication and authorization
4. Set up monitoring and logging
5. Use a production database setup with proper backup and recovery procedures

See the [Deployment Guide](deployment.md) for detailed instructions on deploying BibliosAI to production environments.
