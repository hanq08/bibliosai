from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

# Import authentication dependencies
from .auth import get_current_user, User

router = APIRouter()

# Models
class Message(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    connector_ids: Optional[List[str]] = None

class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    sources: Optional[List[Dict[str, Any]]] = None
    suggested_actions: Optional[List[Dict[str, Any]]] = None

class Conversation(BaseModel):
    id: str
    user_id: str
    title: str
    messages: List[Message]
    created_at: str
    updated_at: str

class ConversationList(BaseModel):
    conversations: List[Dict[str, Any]]

# Mock database for conversations
fake_conversations_db = {}
conversation_id_counter = 0

# Helper functions
def generate_response(message: str, conversation_id: Optional[str], connector_ids: Optional[List[str]]):
    """
    Generate a response using the LLM.
    
    In a real implementation, this would:
    1. Retrieve context from vector store based on the query
    2. Format the prompt with the retrieved context
    3. Call the LLM API to generate a response
    4. Extract sources from the retrieved context
    5. Identify potential actions from the user's message
    """
    # Mock response generation
    response = f"This is a response to: {message}"
    
    # Mock sources
    sources = [
        {
            "title": "Email from John Doe",
            "content": "Meeting scheduled for tomorrow at 2 PM",
            "source_type": "gmail",
            "url": "https://mail.google.com/mail/u/0/#inbox/123",
            "timestamp": "2023-01-01T10:00:00Z",
            "relevance_score": 0.92
        },
        {
            "title": "Slack message in #general",
            "content": "Team meeting agenda for tomorrow",
            "source_type": "slack",
            "url": "https://slack.com/archives/C123/p456",
            "timestamp": "2023-01-01T09:30:00Z",
            "relevance_score": 0.85
        }
    ]
    
    # Mock suggested actions
    suggested_actions = []
    
    # Check for action triggers in the message
    if "email" in message.lower() or "send" in message.lower():
        suggested_actions.append({
            "type": "email",
            "title": "Send Email",
            "description": "Send an email to the mentioned recipients",
            "parameters": {
                "to": "john@example.com",
                "subject": "Follow-up",
                "body": "This is a follow-up email regarding our discussion."
            }
        })
    
    if "schedule" in message.lower() or "meeting" in message.lower():
        suggested_actions.append({
            "type": "calendar",
            "title": "Schedule Meeting",
            "description": "Create a calendar event",
            "parameters": {
                "title": "Follow-up Meeting",
                "start_time": "2023-01-02T14:00:00Z",
                "end_time": "2023-01-02T15:00:00Z",
                "attendees": ["john@example.com", "jane@example.com"]
            }
        })
    
    return {
        "message": response,
        "sources": sources,
        "suggested_actions": suggested_actions
    }

# Routes
@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Send a message and get a response."""
    global conversation_id_counter
    
    # Get or create conversation
    conversation_id = request.conversation_id
    if not conversation_id:
        conversation_id_counter += 1
        conversation_id = str(conversation_id_counter)
        
        # Create new conversation
        fake_conversations_db[conversation_id] = {
            "id": conversation_id,
            "user_id": current_user.email,
            "title": request.message[:30] + "..." if len(request.message) > 30 else request.message,
            "messages": [],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    elif conversation_id not in fake_conversations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID {conversation_id} not found"
        )
    elif fake_conversations_db[conversation_id]["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this conversation"
        )
    
    # Add user message to conversation
    conversation = fake_conversations_db[conversation_id]
    conversation["messages"].append({
        "role": "user",
        "content": request.message,
        "timestamp": datetime.now().isoformat()
    })
    
    # Generate response
    response_data = generate_response(
        message=request.message,
        conversation_id=conversation_id,
        connector_ids=request.connector_ids
    )
    
    # Add assistant message to conversation
    conversation["messages"].append({
        "role": "assistant",
        "content": response_data["message"],
        "timestamp": datetime.now().isoformat()
    })
    
    # Update conversation
    conversation["updated_at"] = datetime.now().isoformat()
    
    # Return response
    return {
        "message": response_data["message"],
        "conversation_id": conversation_id,
        "sources": response_data["sources"],
        "suggested_actions": response_data["suggested_actions"]
    }

@router.get("/conversations", response_model=ConversationList)
async def list_conversations(current_user: User = Depends(get_current_user)):
    """List all conversations for the current user."""
    user_conversations = [
        {
            "id": conv["id"],
            "title": conv["title"],
            "created_at": conv["created_at"],
            "updated_at": conv["updated_at"],
            "message_count": len(conv["messages"])
        }
        for conv in fake_conversations_db.values()
        if conv["user_id"] == current_user.email
    ]
    
    return {"conversations": user_conversations}

@router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific conversation."""
    if conversation_id not in fake_conversations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID {conversation_id} not found"
        )
    
    conversation = fake_conversations_db[conversation_id]
    if conversation["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this conversation"
        )
    
    return conversation

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a conversation."""
    if conversation_id not in fake_conversations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID {conversation_id} not found"
        )
    
    conversation = fake_conversations_db[conversation_id]
    if conversation["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this conversation"
        )
    
    # Delete conversation
    del fake_conversations_db[conversation_id]
    
    return {"message": f"Conversation {conversation_id} deleted successfully"}
