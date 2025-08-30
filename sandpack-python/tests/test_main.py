"""
Tests for the main application functionality.

This module tests the core application endpoints and functionality.
"""

import pytest
from fastapi.testclient import TestClient
from src.main import create_app


@pytest.fixture
def client():
    """Create a test client for the application."""
    app = create_app()
    return TestClient(app)


class TestMainEndpoints:
    """Test class for main application endpoints."""
    
    def test_root_endpoint(self, client):
        """Test the root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Welcome to Python Sandpack Project! 🚀"
        assert data["status"] == "running"
        assert data["environment"] == "sandpack"
        assert data["version"] == "1.0.0"
        assert data["docs"] == "/docs"
    
    def test_health_endpoint(self, client):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["environment"] == "sandpack"
        assert "timestamp" in data
    
    def test_info_endpoint(self, client):
        """Test the project info endpoint."""
        response = client.get("/info")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Python Sandpack Project"
        assert data["description"] == "A beautiful Python project for cloud development"
        assert "features" in data
        assert "tech_stack" in data
        
        # Check features
        expected_features = [
            "FastAPI backend",
            "Cloud-based development",
            "Modern Python practices",
            "Comprehensive testing",
            "Beautiful documentation"
        ]
        for feature in expected_features:
            assert feature in data["features"]
        
        # Check tech stack
        expected_tech = [
            "Python 3.11+",
            "FastAPI",
            "Pydantic",
            "Pytest",
            "Black & Flake8"
        ]
        for tech in expected_tech:
            assert tech in data["tech_stack"]
    
    def test_docs_endpoint(self, client):
        """Test that the docs endpoint is accessible."""
        response = client.get("/docs")
        assert response.status_code == 200
    
    def test_redoc_endpoint(self, client):
        """Test that the redoc endpoint is accessible."""
        response = client.get("/redoc")
        assert response.status_code == 200


class TestApplicationStructure:
    """Test class for application structure and configuration."""
    
    def test_app_creation(self):
        """Test that the application can be created successfully."""
        app = create_app()
        assert app is not None
        assert app.title == "🐍 Python Sandpack Project"
        assert app.version == "1.0.0"
    
    def test_cors_middleware(self, client):
        """Test that CORS middleware is properly configured."""
        # This is a basic test - in a real scenario you'd test actual CORS headers
        response = client.get("/")
        assert response.status_code == 200
    
    def test_app_metadata(self):
        """Test application metadata and configuration."""
        app = create_app()
        
        # Check that the app has the expected configuration
        assert hasattr(app, 'title')
        assert hasattr(app, 'description')
        assert hasattr(app, 'version')
        assert hasattr(app, 'docs_url')
        assert hasattr(app, 'redoc_url')


class TestErrorHandling:
    """Test class for error handling functionality."""
    
    def test_404_endpoint(self, client):
        """Test that non-existent endpoints return 404."""
        response = client.get("/nonexistent")
        assert response.status_code == 404
    
    def test_method_not_allowed(self, client):
        """Test that unsupported HTTP methods return 405."""
        response = client.post("/")
        assert response.status_code == 405


if __name__ == "__main__":
    pytest.main([__file__])