from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from enum import Enum

# Import authentication dependencies
from .auth import get_current_user, User

router = APIRouter()

# Models
class ConnectorType(str, Enum):
    GMAIL = "gmail"
    SLACK = "slack"
    GOOGLE_DRIVE = "google_drive"
    NOTION = "notion"
    JIRA = "jira"
    GITHUB = "github"
    CUSTOM = "custom"

class ConnectorStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    PENDING = "pending"
    ERROR = "error"

class ConnectorBase(BaseModel):
    name: str
    type: ConnectorType
    description: Optional[str] = None

class ConnectorCreate(ConnectorBase):
    config: Dict[str, Any] = {}

class Connector(ConnectorBase):
    id: str
    user_id: str
    status: ConnectorStatus
    last_sync: Optional[str] = None
    created_at: str
    updated_at: str

class ConnectorList(BaseModel):
    connectors: List[Connector]

# Mock database for connectors
fake_connectors_db = {}
connector_id_counter = 0

# Helper functions
def get_connector_handler(connector_type: ConnectorType):
    """Get the appropriate connector handler based on type."""
    handlers = {
        ConnectorType.GMAIL: GmailConnector(),
        ConnectorType.SLACK: SlackConnector(),
        ConnectorType.GOOGLE_DRIVE: GoogleDriveConnector(),
        ConnectorType.NOTION: NotionConnector(),
        ConnectorType.JIRA: JiraConnector(),
        ConnectorType.GITHUB: GithubConnector(),
        ConnectorType.CUSTOM: CustomConnector(),
    }
    return handlers.get(connector_type)

# Base connector class
class BaseConnector:
    def connect(self, config: Dict[str, Any]):
        """Connect to the service."""
        raise NotImplementedError()
    
    def disconnect(self):
        """Disconnect from the service."""
        raise NotImplementedError()
    
    def sync(self):
        """Sync data from the service."""
        raise NotImplementedError()
    
    def get_auth_url(self):
        """Get the OAuth URL for the service."""
        raise NotImplementedError()

# Connector implementations
class GmailConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        # Implement Gmail connection logic
        return {"status": "connected", "message": "Successfully connected to Gmail"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from Gmail"}
    
    def sync(self):
        # Implement Gmail sync logic
        return {"status": "success", "message": "Gmail sync completed", "items_synced": 100}
    
    def get_auth_url(self):
        # Return Gmail OAuth URL
        return "https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&response_type=code"

class SlackConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        # Implement Slack connection logic
        return {"status": "connected", "message": "Successfully connected to Slack"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from Slack"}
    
    def sync(self):
        # Implement Slack sync logic
        return {"status": "success", "message": "Slack sync completed", "items_synced": 50}
    
    def get_auth_url(self):
        # Return Slack OAuth URL
        return "https://slack.com/oauth/authorize"

class GoogleDriveConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        return {"status": "connected", "message": "Successfully connected to Google Drive"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from Google Drive"}
    
    def sync(self):
        return {"status": "success", "message": "Google Drive sync completed", "items_synced": 75}
    
    def get_auth_url(self):
        return "https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive.readonly&response_type=code"

class NotionConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        return {"status": "connected", "message": "Successfully connected to Notion"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from Notion"}
    
    def sync(self):
        return {"status": "success", "message": "Notion sync completed", "items_synced": 30}
    
    def get_auth_url(self):
        return "https://api.notion.com/v1/oauth/authorize"

class JiraConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        return {"status": "connected", "message": "Successfully connected to Jira"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from Jira"}
    
    def sync(self):
        return {"status": "success", "message": "Jira sync completed", "items_synced": 45}
    
    def get_auth_url(self):
        return "https://auth.atlassian.com/authorize"

class GithubConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        return {"status": "connected", "message": "Successfully connected to GitHub"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from GitHub"}
    
    def sync(self):
        return {"status": "success", "message": "GitHub sync completed", "items_synced": 60}
    
    def get_auth_url(self):
        return "https://github.com/login/oauth/authorize"

class CustomConnector(BaseConnector):
    def connect(self, config: Dict[str, Any]):
        return {"status": "connected", "message": "Successfully connected to custom source"}
    
    def disconnect(self):
        return {"status": "disconnected", "message": "Successfully disconnected from custom source"}
    
    def sync(self):
        return {"status": "success", "message": "Custom source sync completed", "items_synced": 20}
    
    def get_auth_url(self):
        return config.get("auth_url", "")

# Routes
@router.get("/", response_model=ConnectorList)
async def list_connectors(current_user: User = Depends(get_current_user)):
    """List all connectors for the current user."""
    user_connectors = [
        connector for connector in fake_connectors_db.values()
        if connector["user_id"] == current_user.email
    ]
    return {"connectors": user_connectors}

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_connector(
    connector: ConnectorCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new connector."""
    global connector_id_counter
    connector_id_counter += 1
    
    connector_handler = get_connector_handler(connector.type)
    if not connector_handler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported connector type: {connector.type}"
        )
    
    # Create connector record
    connector_id = str(connector_id_counter)
    connector_record = {
        "id": connector_id,
        "name": connector.name,
        "type": connector.type,
        "description": connector.description,
        "user_id": current_user.email,
        "status": ConnectorStatus.PENDING,
        "last_sync": None,
        "created_at": "2023-01-01T00:00:00Z",  # Use actual datetime in production
        "updated_at": "2023-01-01T00:00:00Z",
    }
    
    fake_connectors_db[connector_id] = connector_record
    
    # Get auth URL for OAuth-based connectors
    auth_url = connector_handler.get_auth_url()
    
    return {
        "connector": connector_record,
        "auth_url": auth_url,
        "message": f"Connector {connector.name} created. Please complete authentication."
    }

@router.get("/{connector_id}")
async def get_connector(
    connector_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific connector."""
    if connector_id not in fake_connectors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connector with ID {connector_id} not found"
        )
    
    connector = fake_connectors_db[connector_id]
    if connector["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this connector"
        )
    
    return connector

@router.delete("/{connector_id}")
async def delete_connector(
    connector_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a connector."""
    if connector_id not in fake_connectors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connector with ID {connector_id} not found"
        )
    
    connector = fake_connectors_db[connector_id]
    if connector["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this connector"
        )
    
    # Get connector handler to disconnect
    connector_handler = get_connector_handler(connector["type"])
    if connector_handler:
        connector_handler.disconnect()
    
    # Delete connector
    del fake_connectors_db[connector_id]
    
    return {"message": f"Connector {connector_id} deleted successfully"}

@router.post("/{connector_id}/sync", status_code=status.HTTP_202_ACCEPTED)
async def sync_connector(
    connector_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Sync data from a connector."""
    if connector_id not in fake_connectors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connector with ID {connector_id} not found"
        )
    
    connector = fake_connectors_db[connector_id]
    if connector["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to sync this connector"
        )
    
    # Get connector handler to sync
    connector_handler = get_connector_handler(connector["type"])
    if not connector_handler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported connector type: {connector['type']}"
        )
    
    # Add sync task to background tasks
    # In a real implementation, this would be a more complex async task
    background_tasks.add_task(connector_handler.sync)
    
    return {"message": f"Sync started for connector {connector_id}"}

@router.post("/{connector_id}/oauth/callback")
async def oauth_callback(
    connector_id: str,
    code: str,
    current_user: User = Depends(get_current_user)
):
    """Handle OAuth callback for connector authentication."""
    if connector_id not in fake_connectors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connector with ID {connector_id} not found"
        )
    
    connector = fake_connectors_db[connector_id]
    if connector["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this connector"
        )
    
    # Get connector handler to complete authentication
    connector_handler = get_connector_handler(connector["type"])
    if not connector_handler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported connector type: {connector['type']}"
        )
    
    # In a real implementation, exchange the code for tokens and store them securely
    # For this example, we'll just update the connector status
    connector["status"] = ConnectorStatus.CONNECTED
    connector["updated_at"] = "2023-01-01T00:00:00Z"  # Use actual datetime in production
    
    return {
        "message": f"Successfully authenticated connector {connector_id}",
        "connector": connector
    }
