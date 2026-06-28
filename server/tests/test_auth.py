"""
Authentication Endpoint and JWT Claims Validation Unit Tests
"""

import json


def test_register_validation(client):
    """Test user registration input validation checks."""
    # Test missing fields
    res = client.post("/api/auth/register", json={
        "username": "tester",
        "email": "test@test.com",
    })
    assert res.status_code == 400
    assert b"Missing required fields" in res.data

    # Test invalid email format
    res = client.post("/api/auth/register", json={
        "username": "tester",
        "email": "invalid-email-format",
        "password": "Short1!",
        "full_name": "Test User",
    })
    assert res.status_code == 400
    assert b"Invalid email format" in res.data


def test_login_success(client, db):
    """Test successful login returns access and refresh tokens."""
    # Create test user
    client.post("/api/auth/register", json={
        "username": "adminuser",
        "email": "admin@cakes.com",
        "password": "Password123!",
        "full_name": "Bakery Admin",
        "role": "admin",
    })

    # Try login
    res = client.post("/api/auth/login", json={
        "email": "admin@cakes.com",
        "password": "Password123!",
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["username"] == "adminuser"
