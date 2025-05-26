from flask import Blueprint, request, jsonify, abort, g
from services.project_store import store, UserModel
from utils.security import hash_password
from utils.auth import require_role
from services.audit import record

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

    record(
        actor=g.sub,
        resource="user",
        action="create",
        diff=f"Added user: {temp.username} ({temp.role})"
    )

    return {"status": "created"}, 201

@bp.delete("/<string:username>")
@require_role("admin")
def delete_user(username):
    data = store.load()
    i = next((idx for idx, u in enumerate(data.users) if u.username == username), None)
    if i is None:
        abort(404, "user not found")

    removed = data.users.pop(i)
    store.save(data)

    record(
        actor=g.sub,
        resource="user",
        action="delete",
        diff=f"Deleted user: {removed.username}"
    )
    return ("", 204)

@bp.put("/<string:username>")
@require_role("admin", "editor")
def update_user(username):
    payload = request.get_json(force=True, silent=True) or {}
    data = store.load()

    i = next((idx for idx, u in enumerate(data.users) if u.username == username), None)
    if i is None:
        abort(404, "user not found")

    user_to_update = data.users[i]
    old_user_data = user_to_update.model_dump(exclude={"password_hash"})

    if "email" in payload:
        user_to_update.email = payload["email"]
    if "role" in payload:
        if payload["role"] not in ["viewer", "editor", "admin"]:
            abort(400, "Invalid role provided")
        user_to_update.role = payload["role"]
    if "password" in payload and payload["password"]:
        user_to_update.password_hash = hash_password(payload["password"])

    store.save(data)

    new_user_data = user_to_update.model_dump(exclude={"password_hash"})
    diff = f"Updated user: {username}. Old: {old_user_data}, New: {new_user_data}"

    record(
        actor=g.sub,
        resource="user",
        action="update",
        diff=diff
    )

    return {"status": "updated"}, 200