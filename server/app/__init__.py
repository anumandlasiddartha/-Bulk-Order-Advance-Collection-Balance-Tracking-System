"""
Cakes and Crunches — Flask Application Factory

Creates and configures the Flask application instance with all extensions,
blueprints, middleware, and error handlers registered.
"""

from flask import Flask, jsonify
from flask_cors import CORS

from app.config import config_by_name
from app.extensions import db, migrate, jwt, ma, limiter


def create_app(config_name: str = "development") -> Flask:
    """
    Application factory pattern.
    
    Args:
        config_name: One of 'development', 'testing', 'production'.
    
    Returns:
        Configured Flask application instance.
    """
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config_by_name.get(config_name, config_by_name["development"]))

    # Initialize extensions
    _register_extensions(app)

    # Register blueprints (controllers)
    _register_blueprints(app)

    # Register error handlers
    _register_error_handlers(app)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.route("/")
    def index():
        return jsonify({
            "success": True,
            "status": "online",
            "message": "Cakes & Crunches Backend API is running successfully."
        }), 200

    with app.app_context():
        db.create_all()

    return app


def _register_extensions(app: Flask) -> None:
    """Initialize all Flask extensions with the app instance."""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)


def _register_blueprints(app: Flask) -> None:
    """
    Register all API blueprint controllers.
    Each controller is a Flask Blueprint with a URL prefix.
    """
    from app.controllers.auth_controller import auth_bp
    from app.controllers.user_controller import user_bp
    from app.controllers.customer_controller import customer_bp
    from app.controllers.order_controller import order_bp
    from app.controllers.payment_controller import payment_bp
    from app.controllers.wallet_controller import wallet_bp
    from app.controllers.ledger_controller import ledger_bp
    from app.controllers.alert_controller import alert_bp
    from app.controllers.notification_controller import notification_bp
    from app.controllers.report_controller import report_bp
    from app.controllers.admin_controller import admin_bp
    from app.controllers.search_controller import search_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(customer_bp, url_prefix="/api/customers")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(payment_bp, url_prefix="/api/payments")
    app.register_blueprint(wallet_bp, url_prefix="/api/wallet")
    app.register_blueprint(ledger_bp, url_prefix="/api/ledger")
    app.register_blueprint(alert_bp, url_prefix="/api/alerts")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")
    app.register_blueprint(report_bp, url_prefix="/api/reports")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(search_bp, url_prefix="/api/search")


def _register_error_handlers(app: Flask) -> None:
    """Register global error handlers for common HTTP status codes."""
    from app.middleware.error_handler import (
        handle_400,
        handle_401,
        handle_403,
        handle_404,
        handle_422,
        handle_429,
        handle_500,
    )

    app.register_error_handler(400, handle_400)
    app.register_error_handler(401, handle_401)
    app.register_error_handler(403, handle_403)
    app.register_error_handler(404, handle_404)
    app.register_error_handler(422, handle_422)
    app.register_error_handler(429, handle_429)
    app.register_error_handler(500, handle_500)
