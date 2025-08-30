"""
User service for the Python Sandpack Project.

This module handles business logic for user management operations.
"""

from typing import List, Optional, Dict, Any
from ..models.user import User, UserCreate, UserUpdate
from ..models.response import DataResponse, PaginatedResponse
import logging

logger = logging.getLogger(__name__)


class UserService:
    """Service class for user management operations."""
    
    def __init__(self):
        """Initialize the user service."""
        # In a real application, this would connect to a database
        self._users: Dict[str, User] = {}
        self._username_index: Dict[str, str] = {}
        self._email_index: Dict[str, str] = {}
        logger.info("UserService initialized")
    
    async def create_user(self, user_data: UserCreate) -> DataResponse[User]:
        """Create a new user."""
        try:
            # Check if username already exists
            if user_data.username in self._username_index:
                raise ValueError(f"Username '{user_data.username}' already exists")
            
            # Check if email already exists
            if user_data.email in self._email_index:
                raise ValueError(f"Email '{user_data.email}' already exists")
            
            # Create new user (in real app, hash password here)
            user = User(
                email=user_data.email,
                username=user_data.username,
                full_name=user_data.full_name,
                is_active=user_data.is_active
            )
            
            # Store user
            self._users[user.id] = user
            self._username_index[user.username] = user.id
            self._email_index[user.email] = user.id
            
            logger.info(f"Created user: {user.username}")
            
            return DataResponse(
                message="User created successfully",
                data=user
            )
            
        except ValueError as e:
            logger.error(f"Failed to create user: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error creating user: {e}")
            raise
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return self._users.get(user_id)
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        user_id = self._username_index.get(username)
        return self._users.get(user_id) if user_id else None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        user_id = self._email_index.get(email)
        return self._users.get(user_id) if user_id else None
    
    async def get_all_users(self, skip: int = 0, limit: int = 100) -> PaginatedResponse[User]:
        """Get all users with pagination."""
        users_list = list(self._users.values())
        total = len(users_list)
        
        # Apply pagination
        paginated_users = users_list[skip:skip + limit]
        
        return PaginatedResponse(
            message="Users retrieved successfully",
            data=paginated_users,
            pagination={
                "page": (skip // limit) + 1,
                "per_page": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        )
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[DataResponse[User]]:
        """Update user information."""
        user = self._users.get(user_id)
        if not user:
            return None
        
        try:
            # Update fields if provided
            if user_data.email is not None:
                # Check if new email conflicts with existing user
                if user_data.email != user.email and user_data.email in self._email_index:
                    raise ValueError(f"Email '{user_data.email}' already exists")
                
                # Update email index
                old_email = user.email
                self._email_index.pop(old_email, None)
                self._email_index[user_data.email] = user_id
                user.email = user_data.email
            
            if user_data.username is not None:
                # Check if new username conflicts with existing user
                if user_data.username != user.username and user_data.username in self._username_index:
                    raise ValueError(f"Username '{user_data.username}' already exists")
                
                # Update username index
                old_username = user.username
                self._username_index.pop(old_username, None)
                self._username_index[user_data.username] = user_id
                user.username = user_data.username
            
            if user_data.full_name is not None:
                user.full_name = user_data.full_name
            
            if user_data.is_active is not None:
                user.is_active = user_data.is_active
            
            # Update timestamp
            from datetime import datetime
            user.updated_at = datetime.utcnow()
            
            logger.info(f"Updated user: {user.username}")
            
            return DataResponse(
                message="User updated successfully",
                data=user
            )
            
        except ValueError as e:
            logger.error(f"Failed to update user: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error updating user: {e}")
            raise
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        user = self._users.get(user_id)
        if not user:
            return False
        
        try:
            # Remove from indexes
            self._username_index.pop(user.username, None)
            self._email_index.pop(user.email, None)
            
            # Remove user
            self._users.pop(user_id, None)
            
            logger.info(f"Deleted user: {user.username}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting user: {e}")
            return False
    
    async def get_user_stats(self) -> Dict[str, Any]:
        """Get user statistics."""
        total_users = len(self._users)
        active_users = sum(1 for user in self._users.values() if user.is_active)
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "inactive_users": total_users - active_users
        }