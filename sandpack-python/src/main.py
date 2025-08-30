#!/usr/bin/env python3
"""
Main application entry point for Python Sandpack Project.

This is a beautiful, modern Python application optimized for Sandpack IDE.
It provides a clean API structure with proper error handling and documentation.
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title="🐍 Python Sandpack Project",
        description="""
        A beautiful, modern Python project optimized for Sandpack IDE.
        
        ## Features
        * **Cloud-based development** with Sandpack
        * **Modern FastAPI** backend
        * **Clean architecture** following best practices
        * **Comprehensive testing** and documentation
        
        ## Getting Started
        1. Visit [sandpack.codesandbox.io](https://sandpack.codesandbox.io)
        2. Choose Python template
        3. Start coding in the cloud!
        """,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Add CORS middleware for web development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/", tags=["Root"])
    async def root() -> Dict[str, Any]:
        """Welcome endpoint."""
        return {
            "message": "Welcome to Python Sandpack Project! 🚀",
            "status": "running",
            "environment": "sandpack",
            "version": "1.0.0",
            "docs": "/docs"
        }
    
    @app.get("/health", tags=["Health"])
    async def health_check() -> Dict[str, Any]:
        """Health check endpoint."""
        return {
            "status": "healthy",
            "environment": "sandpack",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    
    @app.get("/info", tags=["Info"])
    async def project_info() -> Dict[str, Any]:
        """Project information endpoint."""
        return {
            "name": "Python Sandpack Project",
            "description": "A beautiful Python project for cloud development",
            "features": [
                "FastAPI backend",
                "Cloud-based development",
                "Modern Python practices",
                "Comprehensive testing",
                "Beautiful documentation"
            ],
            "tech_stack": [
                "Python 3.11+",
                "FastAPI",
                "Pydantic",
                "Pytest",
                "Black & Flake8"
            ]
        }
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc):
        """Custom HTTP exception handler."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "status_code": exc.status_code,
                "path": request.url.path
            }
        )
    
    @app.on_event("startup")
    async def startup_event():
        """Application startup event."""
        logger.info("🚀 Python Sandpack Project starting up...")
        logger.info("📚 API documentation available at /docs")
        logger.info("🌐 Health check available at /health")
    
    @app.on_event("shutdown")
    async def shutdown_event():
        """Application shutdown event."""
        logger.info("👋 Python Sandpack Project shutting down...")
    
    return app

if __name__ == "__main__":
    # Create the application
    app = create_app()
    
    # Run with uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True
    )