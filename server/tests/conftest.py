"""
Cakes and Crunches — Test Configuration

Pytest fixtures for the test suite. Provides a test app instance,
test client, and test database.
"""

import pytest

from app import create_app
from app.extensions import db as _db


@pytest.fixture(scope="session")
def app():
    """Create a Flask application instance for the test session."""
    app = create_app("testing")
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="function")
def db(app):
    """Provide a clean database for each test function."""
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.rollback()
        _db.drop_all()


@pytest.fixture(scope="function")
def client(app):
    """Provide a Flask test client."""
    return app.test_client()


@pytest.fixture(scope="function")
def auth_headers(client):
    """
    Register a test user and return JWT auth headers.
    Requires the auth endpoints to be implemented.
    """
    # Register
    client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@cakesandcrunches.com",
        "password": "TestPass123!",
        "full_name": "Test User",
        "role": "admin",
    })

    # Login
    response = client.post("/api/auth/login", json={
        "email": "test@cakesandcrunches.com",
        "password": "TestPass123!",
    })

    data = response.get_json()
    token = data.get("access_token", "")

    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
