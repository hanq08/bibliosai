# BibliosAI Architecture

This document provides an overview of the BibliosAI platform architecture, explaining the key components and how they interact.

## System Overview

BibliosAI is a Retrieval-Augmented Generation (RAG) platform that connects to various data sources, allowing users to query their data using natural language and perform actions with AI assistance. The platform follows a modern microservices architecture with a clear separation between frontend and backend components.

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────────────────────────────────────────┐
│                 │     │                    Backend                          │
│                 │     │                                                     │
│                 │     │  ┌─────────────┐    ┌─────────────┐    ┌─────────┐  │
│                 │     │  │             │    │             │    │         │  │
│    Frontend     │◄────┼─►│   API       │◄──►│  Embedding  │◄──►│ Vector  │  │
│                 │     │  │   Service   │    │  Service    │    │   DB    │  │
│    (React)      │     │  │             │    │             │    │         │  │
│                 │     │  └─────┬───────┘    └─────────────┘    └─────────┘  │
│                 │     │        │                                            │
│                 │     │        │                                            │
│                 │     │        ▼                                            │
│                 │     │  ┌─────────────┐    ┌─────────────┐                 │
│                 │     │  │             │    │             │                 │
│                 │     │  │  Auth       │    │  Action     │                 │
│                 │     │  │  Service    │    │  Service    │                 │
│                 │     │  │             │    │             │                 │
│                 │     │  └─────────────┘    └─────────────┘                 │
│                 │     │                                                     │
└─────────────────┘     └─────────────────────────────────────────────────────┘
        │                                    │
        │                                    │
        ▼                                    ▼
┌─────────────────┐     ┌─────────────────────────────────────────────────────┐
│                 │     │                                                     │
│  User's Browser │     │              External Data Sources                  │
│                 │     │     (Gmail, Slack, Google Drive, etc.)              │
│                 │     │                                                     │
└─────────────────┘     └─────────────────────────────────────────────────────┘
```

## Key Components

### Frontend

The frontend is built with React and provides the user interface for interacting with the BibliosAI platform. Key features include:

- **Authentication**: Login, registration, and OAuth integration
- **Dashboard**: Overview of connected sources and recent activity
- **Chat Interface**: Interact with the LLM using connected data sources
- **Connectors Management**: Connect to various data sources
- **Actions Management**: Approve or reject suggested actions from the LLM
- **Settings**: Manage account and preferences

### Backend

The backend is built with FastAPI and provides the API endpoints for the frontend to interact with. Key components include:

#### API Service

The API service handles HTTP requests from the frontend and orchestrates the other services. It includes:

- **Auth API**: Handles user authentication and authorization
- **Connectors API**: Manages connections to external data sources
- **Chat API**: Processes chat messages and generates responses
- **Actions API**: Manages actionable tasks suggested by the LLM

#### Embedding Service

The embedding service processes documents from connected data sources and generates embeddings for efficient retrieval. It includes:

- **Document Processing**: Splits documents into chunks and processes them
- **Embedding Generation**: Generates vector embeddings for document chunks
- **Vector Search**: Searches for relevant documents based on query embeddings

#### Auth Service

The auth service handles user authentication and authorization, including:

- **User Management**: Create, read, update, and delete users
- **Token Management**: Generate and validate JWT tokens
- **OAuth Integration**: Connect with external identity providers

#### Action Service

The action service handles actionable tasks suggested by the LLM, including:

- **Action Generation**: Generate actionable tasks based on user queries
- **Action Approval**: Process user approvals or rejections of suggested actions
- **Action Execution**: Execute approved actions (send emails, schedule meetings, etc.)

### External Integrations

BibliosAI integrates with various external services:

- **Data Sources**: Gmail, Slack, Google Drive, Notion, Jira, GitHub, etc.
- **Vector Database**: Pinecone, Chroma, etc.
- **LLM Provider**: OpenAI, Anthropic, etc.

## Data Flow

1. **User Authentication**: User logs in via the frontend, which authenticates with the backend auth service
2. **Data Connection**: User connects to external data sources via the connectors API
3. **Data Processing**: Connected data is processed by the embedding service and stored in the vector database
4. **User Query**: User sends a query via the chat interface
5. **Context Retrieval**: Relevant documents are retrieved from the vector database based on the query
6. **Response Generation**: The LLM generates a response based on the query and retrieved context
7. **Action Suggestion**: If applicable, the LLM suggests actions that the user can approve or reject
8. **Action Execution**: Approved actions are executed by the action service

## Security Considerations

- **Authentication**: JWT-based authentication with secure token storage
- **Authorization**: Role-based access control for API endpoints
- **Data Encryption**: Encryption of sensitive data at rest and in transit
- **OAuth Security**: Secure handling of OAuth tokens for external services
- **API Security**: Rate limiting, input validation, and other API security measures

## Deployment Architecture

BibliosAI can be deployed in various environments:

- **Development**: Local development environment with mock services
- **Testing**: Containerized services for integration testing
- **Production**: Scalable cloud deployment with load balancing and high availability

## Future Enhancements

- **Multi-tenant Support**: Support for multiple organizations with isolated data
- **Advanced Analytics**: Insights and analytics on user interactions and data usage
- **Custom Connectors**: Framework for building custom data source connectors
- **Workflow Automation**: Complex workflows with multiple actions and triggers
- **Fine-tuning**: Fine-tuning LLMs on organization-specific data
