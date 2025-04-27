from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import List, Dict, Any, Optional
import uvicorn

app = FastAPI(
    title="BibliosAI API",
    description="API for BibliosAI - Intelligent RAG Platform",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/")
async def root():
    """Root endpoint returning API information."""
    return {
        "name": "BibliosAI API",
        "version": "0.1.0",
        "status": "online",
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Import and include routers
from backend.api.auth import router as auth_router
from backend.api.connectors import router as connectors_router
from backend.api.chat import router as chat_router
from backend.api.actions import router as actions_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(connectors_router, prefix="/connectors", tags=["Data Connectors"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(actions_router, prefix="/actions", tags=["Actions"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
