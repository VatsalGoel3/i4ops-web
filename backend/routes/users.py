from flask import Blueprint, request, jsonify, abort, g
from services.project_store import store, UserModel
from utils.security import hash_password
from utils.auth import require_role
from services.audit import record  # ✅ new import

bp = Blueprint("users", __name__)

@bp.get("/")
@require_role("admin", "viewer", "editor")
def list_users():
    data = store.load()
    return jsonify([u.model_dump(exclude={"password_hash"}) for u in data.users])

@bp.post("/")
@require_role("admin", "editor")
def add_user():
    payload = request.get_json(force=True, silent=True) or {}
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

    # ✅ Audit log entry
    record(
        actor=g.sub,
        resource="user",
        action="create",
        diff=f"Added user: {temp.username} ({temp.role})"
    )

    return {"status": "created"}, 201