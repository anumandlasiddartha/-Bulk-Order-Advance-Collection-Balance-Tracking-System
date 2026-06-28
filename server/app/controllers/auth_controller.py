"""
Auth Controller — Authentication routes (login, register, logout, password management).
"""

from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_jwt,
    verify_jwt_in_request,
)
from app.extensions import db
from app.repositories import UserRepository
from app.models.user import User
from app.utils.validators import validate_email, validate_password_strength
from app.middleware.auth_middleware import auth_required
from app.middleware.rate_limiter import auth_limiter

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
@auth_limiter
def register():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    full_name = data.get("full_name", "").strip()
    role = data.get("role", "staff").strip()

    if not username or not email or not password or not full_name:
        return jsonify({"success": False, "message": "Missing required fields."}), 400

    if not validate_email(email):
        return jsonify({"success": False, "message": "Invalid email format."}), 400

    pw_val = validate_password_strength(password)
    if not pw_val["valid"]:
        return jsonify({"success": False, "message": pw_val["errors"][0]}), 400

    if UserRepository.get_by_email(email):
        return jsonify({"success": False, "message": "Email is already registered."}), 400

    if UserRepository.get_by_username(username):
        return jsonify({"success": False, "message": "Username is already taken."}), 400

    if role not in ["admin", "manager", "staff"]:
        role = "staff"

    user = User(username=username, email=email, full_name=full_name, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "Registration successful.", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
@auth_limiter
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    user = UserRepository.get_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    # Generate tokens containing claims for role-based frontend checks
    additional_claims = {"role": user.role, "full_name": user.full_name}
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "success": True,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/change-password", methods=["POST"])
@auth_required
def change_password():
    data = request.get_json() or {}
    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")

    if not old_password or not new_password:
        return jsonify({"success": False, "message": "Old and new passwords are required."}), 400

    user_id = get_jwt_identity()
    user = UserRepository.get_by_id(int(user_id))

    if not user or not user.check_password(old_password):
        return jsonify({"success": False, "message": "Incorrect current password."}), 400

    pw_val = validate_password_strength(new_password)
    if not pw_val["valid"]:
        return jsonify({"success": False, "message": pw_val["errors"][0]}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"success": True, "message": "Password changed successfully."}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    # Stub reset request log
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    return jsonify({
        "success": True,
        "message": "If this email is registered, a password reset request has been logged.",
    }), 200


@auth_bp.route("/me", methods=["GET"])
@auth_required
def me():
    user_id = get_jwt_identity()
    user = UserRepository.get_by_id(int(user_id))
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    return jsonify({"success": True, "user": user.to_dict()}), 200
