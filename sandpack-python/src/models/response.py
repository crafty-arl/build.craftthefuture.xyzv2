"""
Response models for the Python Sandpack Project.

This module defines standardized response models for consistent API communication.
"""

from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional, Any, List
from datetime import datetime


class APIResponse(BaseModel):
    """Standard API response wrapper."""
    
    success: bool = Field(..., description="Whether the request was successful")
    message: str = Field(..., description="Response message")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    
    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ErrorResponse(APIResponse):
    """Error response model."""
    
    success: bool = Field(False, description="Request was not successful")
    error_code: Optional[str] = Field(None, description="Error code for client handling")
    details: Optional[Any] = Field(None, description="Additional error details")
    
    class Config:
        """Pydantic configuration."""
        schema_extra = {
            "example": {
                "success": False,
                "message": "Validation error occurred",
                "timestamp": "2024-01-01T00:00:00",
                "error_code": "VALIDATION_ERROR",
                "details": {
                    "field": "email",
                    "issue": "Invalid email format"
                }
            }
        }


# Generic type for data responses
T = TypeVar('T')


class DataResponse(APIResponse, Generic[T]):
    """Generic data response model."""
    
    success: bool = Field(True, description="Request was successful")
    data: T = Field(..., description="Response data")
    
    class Config:
        """Pydantic configuration."""
        schema_extra = {
            "example": {
                "success": True,
                "message": "Data retrieved successfully",
                "timestamp": "2024-01-01T00:00:00",
                "data": {
                    "id": "123",
                    "name": "Example Item"
                }
            }
        }


class PaginatedResponse(APIResponse, Generic[T]):
    """Paginated data response model."""
    
    success: bool = Field(True, description="Request was successful")
    data: List[T] = Field(..., description="List of items")
    pagination: dict = Field(..., description="Pagination information")
    
    class Config:
        """Pydantic configuration."""
        schema_extra = {
            "example": {
                "success": True,
                "message": "Data retrieved successfully",
                "timestamp": "2024-01-01T00:00:00",
                "data": [
                    {"id": "1", "name": "Item 1"},
                    {"id": "2", "name": "Item 2"}
                ],
                "pagination": {
                    "page": 1,
                    "per_page": 10,
                    "total": 100,
                    "pages": 10
                }
            }
        }