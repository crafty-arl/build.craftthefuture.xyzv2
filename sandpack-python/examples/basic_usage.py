#!/usr/bin/env python3
"""
Basic usage examples for the Python Sandpack Project.

This script demonstrates how to use the main components of the project.
"""

import asyncio
import sys
import os

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from models.user import UserCreate, UserUpdate, User
from services.user_service import UserService
from utils.helpers import format_timestamp, generate_id, validate_email


async def main():
    """Main example function."""
    print("🐍 Python Sandpack Project - Basic Usage Examples")
    print("=" * 50)
    
    # Initialize the user service
    user_service = UserService()
    
    # Example 1: Create users
    print("\n1. Creating Users")
    print("-" * 20)
    
    users_to_create = [
        UserCreate(
            email="john.doe@example.com",
            username="johndoe",
            full_name="John Doe",
            password="SecurePass123"
        ),
        UserCreate(
            email="jane.smith@example.com",
            username="janesmith",
            full_name="Jane Smith",
            password="SecurePass456"
        ),
        UserCreate(
            email="bob.wilson@example.com",
            username="bobwilson",
            full_name="Bob Wilson",
            password="SecurePass789"
        )
    ]
    
    created_users = []
    for user_data in users_to_create:
        try:
            result = await user_service.create_user(user_data)
            created_users.append(result.data)
            print(f"✅ Created user: {result.data.username} ({result.data.email})")
        except ValueError as e:
            print(f"❌ Failed to create user {user_data.username}: {e}")
    
    # Example 2: Retrieve users
    print("\n2. Retrieving Users")
    print("-" * 20)
    
    # Get all users
    all_users = await user_service.get_all_users()
    print(f"📊 Total users: {all_users.pagination['total']}")
    
    # Get specific user
    if created_users:
        first_user = created_users[0]
        retrieved_user = await user_service.get_user_by_id(first_user.id)
        if retrieved_user:
            print(f"👤 Retrieved user: {retrieved_user.username}")
    
    # Example 3: Update user
    print("\n3. Updating Users")
    print("-" * 20)
    
    if created_users:
        user_to_update = created_users[0]
        update_data = UserUpdate(
            full_name="John Doe Updated",
            is_active=False
        )
        
        try:
            result = await user_service.update_user(user_to_update.id, update_data)
            if result:
                print(f"✅ Updated user: {result.data.username}")
                print(f"   New full name: {result.data.full_name}")
                print(f"   Active status: {result.data.is_active}")
        except ValueError as e:
            print(f"❌ Failed to update user: {e}")
    
    # Example 4: User statistics
    print("\n4. User Statistics")
    print("-" * 20)
    
    stats = await user_service.get_user_stats()
    print(f"📈 Total users: {stats['total_users']}")
    print(f"🟢 Active users: {stats['active_users']}")
    print(f"🔴 Inactive users: {stats['inactive_users']}")
    
    # Example 5: Utility functions
    print("\n5. Utility Functions")
    print("-" * 20)
    
    # Generate ID
    new_id = generate_id("user")
    print(f"🆔 Generated ID: {new_id}")
    
    # Validate email
    test_emails = ["valid@example.com", "invalid-email", "another@test.co.uk"]
    for email in test_emails:
        is_valid = validate_email(email)
        status = "✅ Valid" if is_valid else "❌ Invalid"
        print(f"📧 {email}: {status}")
    
    # Format timestamp
    from datetime import datetime
    now = datetime.utcnow()
    formatted_time = format_timestamp(now)
    print(f"⏰ Formatted timestamp: {formatted_time}")
    
    # Example 6: Error handling
    print("\n6. Error Handling Examples")
    print("-" * 20)
    
    # Try to create duplicate user
    try:
        duplicate_user = UserCreate(
            email="john.doe@example.com",  # Already exists
            username="johndoe",            # Already exists
            password="SecurePass123"
        )
        await user_service.create_user(duplicate_user)
    except ValueError as e:
        print(f"❌ Expected error (duplicate user): {e}")
    
    # Try to get non-existent user
    non_existent_user = await user_service.get_user_by_id("non-existent-id")
    if non_existent_user is None:
        print("ℹ️  Non-existent user returns None (as expected)")
    
    print("\n" + "=" * 50)
    print("🎉 Examples completed successfully!")
    print("💡 Check the API documentation at /docs for more endpoints")


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())