from flask import Blueprint, request, jsonify
from services.project_store import store
from utils.security import hash_password

bp = Blueprint("users", __name__)

@bp.get("/")
def add_user():
    payload = request.get_json()
    payload["password_hash"] = hash_password(payload.pop("password"))
    data = store.load()
    data.users.append(payload)
    store.save(data)
    return {"status": "created"}, 201