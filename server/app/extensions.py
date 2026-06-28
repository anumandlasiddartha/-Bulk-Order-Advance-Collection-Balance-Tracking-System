"""
Cakes and Crunches — Flask Extensions

Centralized initialization of all Flask extensions.
Each extension is created without an app instance and bound later
via the application factory's init_app calls.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# ORM & database migrations
db = SQLAlchemy()
migrate = Migrate()

# JWT authentication
jwt = JWTManager()

# Serialization & validation
ma = Marshmallow()

# Rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per hour"],
    storage_uri="memory://",
)
