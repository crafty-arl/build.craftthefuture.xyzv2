"""
Configuration settings for the Python Sandpack Project.

This module manages application configuration using environment variables.
"""

import os
from typing import Optional
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application settings configuration."""
    
    # Application settings
    app_name: str = Field(default="Python Sandpack Project", description="Application name")
    app_version: str = Field(default="1.0.0", description="Application version")
    app_description: str = Field(
        default="A beautiful Python project optimized for Sandpack IDE",
        description="Application description"
    )
    
    # Server settings
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")
    debug: bool = Field(default=True, description="Debug mode")
    reload: bool = Field(default=True, description="Auto-reload on code changes")
    
    # Environment settings
    environment: str = Field(default="development", description="Environment (development/production)")
    log_level: str = Field(default="INFO", description="Logging level")
    
    # CORS settings
    cors_origins: list = Field(default=["*"], description="Allowed CORS origins")
    cors_credentials: bool = Field(default=True, description="Allow CORS credentials")
    
    # Database settings (for future use)
    database_url: Optional[str] = Field(default=None, description="Database connection URL")
    
    # Security settings (for future use)
    secret_key: str = Field(
        default="your-secret-key-change-in-production",
        description="Secret key for security"
    )
    
    # API settings
    api_prefix: str = Field(default="/api/v1", description="API prefix")
    docs_url: str = Field(default="/docs", description="API documentation URL")
    redoc_url: str = Field(default="/redoc", description="ReDoc documentation URL")
    
    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        
        # Environment variable mappings
        fields = {
            "app_name": {"env": "APP_NAME"},
            "app_version": {"env": "APP_VERSION"},
            "app_description": {"env": "APP_DESCRIPTION"},
            "host": {"env": "HOST"},
            "port": {"env": "PORT"},
            "debug": {"env": "DEBUG"},
            "reload": {"env": "RELOAD"},
            "environment": {"env": "ENVIRONMENT"},
            "log_level": {"env": "LOG_LEVEL"},
            "database_url": {"env": "DATABASE_URL"},
            "secret_key": {"env": "SECRET_KEY"},
            "api_prefix": {"env": "API_PREFIX"},
            "docs_url": {"env": "DOCS_URL"},
            "redoc_url": {"env": "REDOC_URL"},
        }
    
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment.lower() == "development"
    
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment.lower() == "production"
    
    def get_cors_origins(self) -> list:
        """Get CORS origins from environment or use defaults."""
        env_origins = os.getenv("CORS_ORIGINS")
        if env_origins:
            return [origin.strip() for origin in env_origins.split(",")]
        return self.cors_origins


# Create global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get the global settings instance."""
    return settings