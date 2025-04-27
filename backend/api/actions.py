from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

# Import authentication dependencies
from .auth import get_current_user, User

router = APIRouter()

# Models
class ActionType(str, Enum):
    EMAIL = "email"
    CALENDAR = "calendar"
    SLACK = "slack"
    TASK = "task"
    CUSTOM = "custom"

class ActionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    FAILED = "failed"

class ActionBase(BaseModel):
    type: ActionType
    title: str
    description: Optional[str] = None
    parameters: Dict[str, Any] = {}

class ActionCreate(ActionBase):
    pass

class Action(ActionBase):
    id: str
    user_id: str
    status: ActionStatus
    created_at: str
    updated_at: str
    completed_at: Optional[str] = None
    result: Optional[Dict[str, Any]] = None

class ActionList(BaseModel):
    actions: List[Action]

# Mock database for actions
fake_actions_db = {}
action_id_counter = 0

# Helper functions
def get_action_handler(action_type: ActionType):
    """Get the appropriate action handler based on type."""
    handlers = {
        ActionType.EMAIL: EmailActionHandler(),
        ActionType.CALENDAR: CalendarActionHandler(),
        ActionType.SLACK: SlackActionHandler(),
        ActionType.TASK: TaskActionHandler(),
        ActionType.CUSTOM: CustomActionHandler(),
    }
    return handlers.get(action_type)

# Base action handler class
class BaseActionHandler:
    def validate(self, parameters: Dict[str, Any]):
        """Validate action parameters."""
        raise NotImplementedError()
    
    def execute(self, parameters: Dict[str, Any]):
        """Execute the action."""
        raise NotImplementedError()

# Action handler implementations
class EmailActionHandler(BaseActionHandler):
    def validate(self, parameters: Dict[str, Any]):
        required_params = ["to", "subject", "body"]
        for param in required_params:
            if param not in parameters:
                raise ValueError(f"Missing required parameter: {param}")
        
        # Validate email format
        # In a real implementation, use a proper email validation library
        if not isinstance(parameters["to"], str) and not isinstance(parameters["to"], list):
            raise ValueError("'to' parameter must be a string or list of strings")
        
        return True
    
    def execute(self, parameters: Dict[str, Any]):
        # In a real implementation, use an email sending library
        return {
            "status": "success",
            "message": f"Email sent to {parameters['to']}",
            "details": {
                "to": parameters["to"],
                "subject": parameters["subject"],
                "sent_at": datetime.now().isoformat()
            }
        }

class CalendarActionHandler(BaseActionHandler):
    def validate(self, parameters: Dict[str, Any]):
        required_params = ["title", "start_time", "end_time"]
        for param in required_params:
            if param not in parameters:
                raise ValueError(f"Missing required parameter: {param}")
        
        # Validate datetime format
        # In a real implementation, use a proper datetime validation
        
        return True
    
    def execute(self, parameters: Dict[str, Any]):
        # In a real implementation, use a calendar API
        return {
            "status": "success",
            "message": f"Meeting '{parameters['title']}' scheduled",
            "details": {
                "title": parameters["title"],
                "start_time": parameters["start_time"],
                "end_time": parameters["end_time"],
                "attendees": parameters.get("attendees", []),
                "event_id": "cal_123456"
            }
        }

class SlackActionHandler(BaseActionHandler):
    def validate(self, parameters: Dict[str, Any]):
        required_params = ["channel", "message"]
        for param in required_params:
            if param not in parameters:
                raise ValueError(f"Missing required parameter: {param}")
        
        return True
    
    def execute(self, parameters: Dict[str, Any]):
        # In a real implementation, use the Slack API
        return {
            "status": "success",
            "message": f"Message sent to Slack channel {parameters['channel']}",
            "details": {
                "channel": parameters["channel"],
                "sent_at": datetime.now().isoformat(),
                "message_id": "slack_123456"
            }
        }

class TaskActionHandler(BaseActionHandler):
    def validate(self, parameters: Dict[str, Any]):
        required_params = ["title"]
        for param in required_params:
            if param not in parameters:
                raise ValueError(f"Missing required parameter: {param}")
        
        return True
    
    def execute(self, parameters: Dict[str, Any]):
        # In a real implementation, use a task management API
        return {
            "status": "success",
            "message": f"Task '{parameters['title']}' created",
            "details": {
                "title": parameters["title"],
                "due_date": parameters.get("due_date"),
                "task_id": "task_123456"
            }
        }

class CustomActionHandler(BaseActionHandler):
    def validate(self, parameters: Dict[str, Any]):
        # Custom actions should define their own validation
        return True
    
    def execute(self, parameters: Dict[str, Any]):
        # Custom actions should define their own execution
        return {
            "status": "success",
            "message": "Custom action executed",
            "details": parameters
        }

# Routes
@router.get("/", response_model=ActionList)
async def list_actions(
    status: Optional[ActionStatus] = None,
    current_user: User = Depends(get_current_user)
):
    """List all actions for the current user."""
    user_actions = [
        action for action in fake_actions_db.values()
        if action["user_id"] == current_user.email and
        (status is None or action["status"] == status)
    ]
    return {"actions": user_actions}

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_action(
    action: ActionCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new action."""
    global action_id_counter
    action_id_counter += 1
    
    # Validate action parameters
    action_handler = get_action_handler(action.type)
    if not action_handler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported action type: {action.type}"
        )
    
    try:
        action_handler.validate(action.parameters)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Create action record
    action_id = str(action_id_counter)
    action_record = {
        "id": action_id,
        "type": action.type,
        "title": action.title,
        "description": action.description,
        "parameters": action.parameters,
        "user_id": current_user.email,
        "status": ActionStatus.PENDING,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "completed_at": None,
        "result": None
    }
    
    fake_actions_db[action_id] = action_record
    
    return action_record

@router.get("/{action_id}")
async def get_action(
    action_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific action."""
    if action_id not in fake_actions_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action with ID {action_id} not found"
        )
    
    action = fake_actions_db[action_id]
    if action["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this action"
        )
    
    return action

@router.post("/{action_id}/approve")
async def approve_action(
    action_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Approve an action for execution."""
    if action_id not in fake_actions_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action with ID {action_id} not found"
        )
    
    action = fake_actions_db[action_id]
    if action["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to approve this action"
        )
    
    if action["status"] != ActionStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Action is not in PENDING state, current state: {action['status']}"
        )
    
    # Update action status
    action["status"] = ActionStatus.APPROVED
    action["updated_at"] = datetime.now().isoformat()
    
    # Execute action in background
    background_tasks.add_task(execute_action, action_id)
    
    return {
        "message": f"Action {action_id} approved and queued for execution",
        "action": action
    }

@router.post("/{action_id}/reject")
async def reject_action(
    action_id: str,
    current_user: User = Depends(get_current_user)
):
    """Reject an action."""
    if action_id not in fake_actions_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action with ID {action_id} not found"
        )
    
    action = fake_actions_db[action_id]
    if action["user_id"] != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to reject this action"
        )
    
    if action["status"] != ActionStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Action is not in PENDING state, current state: {action['status']}"
        )
    
    # Update action status
    action["status"] = ActionStatus.REJECTED
    action["updated_at"] = datetime.now().isoformat()
    
    return {
        "message": f"Action {action_id} rejected",
        "action": action
    }

# Helper function for executing actions
async def execute_action(action_id: str):
    """Execute an approved action."""
    if action_id not in fake_actions_db:
        return
    
    action = fake_actions_db[action_id]
    if action["status"] != ActionStatus.APPROVED:
        return
    
    # Get action handler
    action_handler = get_action_handler(action["type"])
    if not action_handler:
        action["status"] = ActionStatus.FAILED
        action["result"] = {
            "error": f"Unsupported action type: {action['type']}"
        }
        action["updated_at"] = datetime.now().isoformat()
        return
    
    try:
        # Execute action
        result = action_handler.execute(action["parameters"])
        
        # Update action record
        action["status"] = ActionStatus.COMPLETED
        action["result"] = result
        action["completed_at"] = datetime.now().isoformat()
        action["updated_at"] = datetime.now().isoformat()
    except Exception as e:
        # Handle execution error
        action["status"] = ActionStatus.FAILED
        action["result"] = {
            "error": str(e)
        }
        action["updated_at"] = datetime.now().isoformat()
