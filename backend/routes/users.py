from flask import Blueprint, request, jsonify, abort
from services.project_store import store, UserModel
from utils.security import hash_password

bp = Blueprint("users", __name__)

@bp.get("/")
def list_users():
    data = store.load()
    return jsonify([u.model_dump(exclude={"password_hash"}) for u in data.users])

@bp.post("/")
def add_user():
    payload = request.get_json(force=True, silent=True) or {}
    # validate & transform
    try:
        temp = UserModel(
            username=payload["username"],
            email=payload["email"],
            role=payload.get("role", "viewer"),
            password_hash=hash_password(payload["password"]),
        )
    except Exception as exc:
        abort(400, str(exc))
        
    data = store.load()
    data.users.append(temp)
    store.save(data)
    return {"status": "created"}, 201