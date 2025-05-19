from flask import Blueprint, request, jsonify, abort
from services.project_store import store, UserModel
from utils.yaml_diff import unified_yaml_diff
from utils.security import hash_password

bp = Blueprint("diff", __name__)

@bp.post("/users")
def diff_user_add():
    """Preview YAML diff for adding a single user without persisting."""
    payload = request.get_json(force=True, silent=True) or {}
    try:
        user = UserModel(
            username=payload["username"],
            email=payload["email"],
            role=payload.get("role", "viewer"),
            password_hash=hash_password(payload["password"]),
        )
    except Exception as exc:
        abort(400, str(exc))

    current = store.load()
    proposed = current.model_copy(deep=True)
    proposed.users.append(user)

    diff_text = unified_yaml_diff(current, proposed)
    return jsonify({"diff": diff_text})