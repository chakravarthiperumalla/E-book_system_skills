import sys
import os

# Append current directory to path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.config.db import Base, engine, SessionLocal
import pytest

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    # Make sure tables are created in the test database
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup (optional - can drop if we want clean tests each time)
    # Base.metadata.drop_all(bind=engine)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

def test_register_and_login():
    # Unique email for testing
    import uuid
    email = f"test_{uuid.uuid4().hex}@ebook.com"
    
    # 1. Register User
    reg_payload = {
        "name": "Test Reader",
        "email": email,
        "password": "testpassword123"
    }
    response = client.post("/api/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == email
    
    # 2. Login User
    login_payload = {
        "email": email,
        "password": "testpassword123"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    login_data = response.json()
    assert "access_token" in login_data
    assert login_data["user"]["name"] == "Test Reader"

def test_get_books():
    response = client.get("/api/books")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
