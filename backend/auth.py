from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

@auth_bp.post("/register")
def register():
    data = request.get_json(force=True)
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    u = User(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(u)
    db.session.commit()
    return jsonify({"message": "Registered successfully"}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json(force=True)
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Simple college-project approach: return user_id; no JWT for now.
    return jsonify({"message": "Login ok", "user_id": user.id, "name": user.name}), 200
