from flask import Blueprint, request, jsonify, abort, g
from services.project_store import store, UserModel
from utils.security import hash_password
from utils.auth import require_role
from services.audit import record

bp = Blueprint("users", __name__)

# ────────────────────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────────────────────
def _find_user(data, username: str):
    """Return (index, UserModel) or (None, None)"""
    for idx, u in enumerate(data.users):
        if u.username == username:
            return idx, u
    return None, None


# ────────────────────────────────────────────────────────────
# Routes
# ────────────────────────────────────────────────────────────
@bp.get("/")
@require_role("admin", "viewer", "editor")
def list_users():
    data = store.load()
    # never send password hash back to the client
    return jsonify([u.model_dump(exclude={"password_hash"}) for u in data.users])


@bp.post("/")
@require_role("admin", "editor")
def add_user():
    payload = request.get_json(force=True, silent=True) or {}
    try:
        temp = UserModel(
            username      = payload["username"],
            email         = payload["email"],
            role          = payload.get("role",   "viewer"),
            password_hash = hash_password(payload["password"]),
            active        = payload.get("active", True),     # ← NEW
        )
    except Exception as exc:
        abort(400, str(exc))

    data = store.load()
    data.users.append(temp)
    store.save(data)

    record(
        actor    = g.sub,
        resource = "user",
        action   = "create",
        diff     = f"Added user: {temp.username} ({temp.role}, active={temp.active})",
    )
    return {"status": "created"}, 201


@bp.delete("/<string:username>")
@require_role("admin")
def delete_user(username):
    data = store.load()
    idx, user = _find_user(data, username)
    if idx is None:
        abort(404, "user not found")

    data.users.pop(idx)
    store.save(data)

    record(
        actor    = g.sub,
        resource = "user",
        action   = "delete",
        diff     = f"Deleted user: {user.username}",
    )
    return ("", 204)


@bp.patch("/<string:username>")               
@require_role("admin", "editor")
def patch_user(username):
    """
    Update **only** the fields provided in the JSON payload.
    Supported keys: email, role, password, active
    """
    payload = request.get_json(force=True, silent=True) or {}
    data    = store.load()

    idx, user = _find_user(data, username)
    if idx is None:
        abort(404, "user not found")

    before = user.model_dump(exclude={"password_hash"})

    if "email" in payload:
        user.email = payload["email"]

    if "role" in payload:
        if payload["role"] not in ("viewer", "editor", "admin"):
            abort(400, "Invalid role value")
        user.role = payload["role"]

    if "password" in payload and payload["password"]:
        user.password_hash = hash_password(payload["password"])

    if "active" in payload:
        user.active = bool(payload["active"])

    store.save(data)

    after = user.model_dump(exclude={"password_hash"})
    record(
        actor    = g.sub,
        resource = "user",
        action   = "update",
        diff     = f"Updated user {username}: {before} → {after}",
    )
    return {"status": "updated"}, 200