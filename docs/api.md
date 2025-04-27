# BibliosAI API Documentation

This document provides detailed information about the BibliosAI API endpoints, request/response formats, and authentication.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:8000
```

For production deployments, this would be your domain, e.g., `https://api.bibliosai.com`.

## Authentication

Most API endpoints require authentication. BibliosAI uses JWT (JSON Web Token) for authentication.

### Obtaining a Token

```
POST /auth/token
```

**Request Body:**

```
username=user@example.com&password=password
```

**Headers:**

```
Content-Type: application/x-www-form-urlencoded
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using the Token

Include the token in the `Authorization` header for all authenticated requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Authentication API

#### Register a new user

```
POST /auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

#### Get current user

```
GET /auth/me
```

**Response:**

```json
{
  "email": "user@example.com",
  "full_name": "John Doe"
}
```

### Connectors API

#### List all connectors

```
GET /connectors
```

**Response:**

```json
{
  "connectors": [
    {
      "id": "1",
      "name": "Work Gmail",
      "type": "gmail",
      "description": "My work email account",
      "status": "connected",
      "last_sync": "2023-01-15T10:30:00Z",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-15T10:30:00Z"
    }
  ]
}
```

#### Get a specific connector

```
GET /connectors/{connector_id}
```

**Response:**

```json
{
  "id": "1",
  "name": "Work Gmail",
  "type": "gmail",
  "description": "My work email account",
  "status": "connected",
  "last_sync": "2023-01-15T10:30:00Z",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-15T10:30:00Z",
  "config": {
    "email": "user@example.com",
    "folders": ["INBOX", "Sent", "Important"],
    "sync_frequency": "hourly",
    "max_emails": 1000
  }
}
```

#### Create a new connector

```
POST /connectors
```

**Request Body:**

```json
{
  "name": "Work Gmail",
  "type": "gmail",
  "description": "My work email account",
  "config": {
    "email": "user@example.com"
  }
}
```

**Response:**

```json
{
  "connector": {
    "id": "1",
    "name": "Work Gmail",
    "type": "gmail",
    "description": "My work email account",
    "status": "pending",
    "last_sync": null,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "auth_url": "https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&response_type=code",
  "message": "Connector Work Gmail created. Please complete authentication."
}
```

#### Update a connector

```
PUT /connectors/{connector_id}
```

**Request Body:**

```json
{
  "name": "Updated Gmail Name",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "id": "1",
  "name": "Updated Gmail Name",
  "type": "gmail",
  "description": "Updated description",
  "status": "connected",
  "last_sync": "2023-01-15T10:30:00Z",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-16T00:00:00Z"
}
```

#### Delete a connector

```
DELETE /connectors/{connector_id}
```

**Response:**

```json
{
  "message": "Connector 1 deleted successfully"
}
```

#### Sync a connector

```
POST /connectors/{connector_id}/sync
```

**Response:**

```json
{
  "message": "Sync started for connector 1"
}
```

### Chat API

#### Send a message

```
POST /chat
```

**Request Body:**

```json
{
  "message": "What meetings do I have tomorrow?",
  "conversation_id": null,
  "connector_ids": ["1", "2"]
}
```

**Response:**

```json
{
  "message": "You have 3 meetings scheduled for tomorrow: 10:00 AM - Team Standup, 1:00 PM - Client Meeting, 4:00 PM - Project Review.",
  "conversation_id": "1",
  "sources": [
    {
      "title": "Email from John Doe",
      "content": "Meeting scheduled for tomorrow at 2 PM",
      "source_type": "gmail",
      "url": "https://mail.google.com/mail/u/0/#inbox/123",
      "timestamp": "2023-01-01T10:00:00Z",
      "relevance_score": 0.92
    }
  ],
  "suggested_actions": [
    {
      "type": "calendar",
      "title": "Schedule Meeting",
      "description": "Create a calendar event",
      "parameters": {
        "title": "Follow-up Meeting",
        "start_time": "2023-01-02T14:00:00Z",
        "end_time": "2023-01-02T15:00:00Z",
        "attendees": ["john@example.com", "jane@example.com"]
      }
    }
  ]
}
```

#### List conversations

```
GET /chat/conversations
```

**Response:**

```json
{
  "conversations": [
    {
      "id": "1",
      "title": "Meeting schedule inquiry",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:10:00Z",
      "message_count": 4
    }
  ]
}
```

#### Get a conversation

```
GET /chat/conversations/{conversation_id}
```

**Response:**

```json
{
  "id": "1",
  "user_id": "user@example.com",
  "title": "Meeting schedule inquiry",
  "messages": [
    {
      "role": "user",
      "content": "What meetings do I have tomorrow?",
      "timestamp": "2023-01-01T00:00:00Z"
    },
    {
      "role": "assistant",
      "content": "You have 3 meetings scheduled for tomorrow: 10:00 AM - Team Standup, 1:00 PM - Client Meeting, 4:00 PM - Project Review.",
      "timestamp": "2023-01-01T00:00:05Z"
    }
  ],
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:05Z"
}
```

#### Delete a conversation

```
DELETE /chat/conversations/{conversation_id}
```

**Response:**

```json
{
  "message": "Conversation 1 deleted successfully"
}
```

### Actions API

#### List actions

```
GET /actions
```

**Query Parameters:**

- `status` (optional): Filter by status (pending, approved, completed, rejected, failed)

**Response:**

```json
{
  "actions": [
    {
      "id": "1",
      "type": "email",
      "title": "Send Email",
      "description": "Send an email to John",
      "parameters": {
        "to": "john@example.com",
        "subject": "Follow-up",
        "body": "This is a follow-up email regarding our discussion."
      },
      "status": "pending",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### Get an action

```
GET /actions/{action_id}
```

**Response:**

```json
{
  "id": "1",
  "type": "email",
  "title": "Send Email",
  "description": "Send an email to John",
  "parameters": {
    "to": "john@example.com",
    "subject": "Follow-up",
    "body": "This is a follow-up email regarding our discussion."
  },
  "status": "pending",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### Create an action

```
POST /actions
```

**Request Body:**

```json
{
  "type": "email",
  "title": "Send Email",
  "description": "Send an email to John",
  "parameters": {
    "to": "john@example.com",
    "subject": "Follow-up",
    "body": "This is a follow-up email regarding our discussion."
  }
}
```

**Response:**

```json
{
  "id": "1",
  "type": "email",
  "title": "Send Email",
  "description": "Send an email to John",
  "parameters": {
    "to": "john@example.com",
    "subject": "Follow-up",
    "body": "This is a follow-up email regarding our discussion."
  },
  "status": "pending",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### Approve an action

```
POST /actions/{action_id}/approve
```

**Response:**

```json
{
  "message": "Action 1 approved and queued for execution",
  "action": {
    "id": "1",
    "type": "email",
    "title": "Send Email",
    "description": "Send an email to John",
    "parameters": {
      "to": "john@example.com",
      "subject": "Follow-up",
      "body": "This is a follow-up email regarding our discussion."
    },
    "status": "approved",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:10:00Z"
  }
}
```

#### Reject an action

```
POST /actions/{action_id}/reject
```

**Response:**

```json
{
  "message": "Action 1 rejected",
  "action": {
    "id": "1",
    "type": "email",
    "title": "Send Email",
    "description": "Send an email to John",
    "parameters": {
      "to": "john@example.com",
      "subject": "Follow-up",
      "body": "This is a follow-up email regarding our discussion."
    },
    "status": "rejected",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:10:00Z"
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

### Common Status Codes

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: The authenticated user doesn't have permission to access the resource
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:

- 100 requests per minute per user
- 1000 requests per hour per user

When a rate limit is exceeded, the API will return a `429 Too Many Requests` status code.

## Versioning

The API is versioned using URL path versioning. The current version is v1.

```
/api/v1/resource
```

## Webhooks

BibliosAI supports webhooks for real-time notifications of events. To register a webhook:

```
POST /webhooks
```

**Request Body:**

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["action.created", "action.completed"]
}
```

**Response:**

```json
{
  "id": "1",
  "url": "https://your-server.com/webhook",
  "events": ["action.created", "action.completed"],
  "created_at": "2023-01-01T00:00:00Z"
}
```

## SDK

BibliosAI provides official SDKs for several programming languages:

- [Python SDK](https://github.com/bibliosai/bibliosai-python)
- [JavaScript SDK](https://github.com/bibliosai/bibliosai-js)
- [Ruby SDK](https://github.com/bibliosai/bibliosai-ruby)

## Support

If you have any questions or need help with the API, please contact us at support@bibliosai.com or open an issue on our [GitHub repository](https://github.com/bibliosai/bibliosai).
