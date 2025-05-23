from flask import Blueprint, request, jsonify, abort, g
from services.project_store import store, ProjectModel
from utils.yaml_diff import unified_yaml_diff
from utils.git_commit import commit_yaml
from utils.auth import require_role
from services.audit import record  # ✅ new import

bp = Blueprint("projects", __name__)
bp.strict_slashes = False

@bp.get("/")
@require_role("admin", "viewer", "editor")
def list_projects():
    return jsonify([p.model_dump() for p in store.load().projects])

@bp.post("/")
@require_role("admin", "editor")
def add_project():
    payload = request.get_json(force=True, silent=True) or {}
    try:
        proj = ProjectModel(**payload)
    except Exception as exc:
        abort(400, str(exc))

    data = store.load()
    data.projects.append(proj)
    store.save(data)
    commit_yaml(f"feat(project): add {proj.id}")

    # ✅ Audit log entry
    record(
        actor=g.sub,
        resource="project",
        action="create",
        diff=f"Added project: {proj.id} - {proj.pretty_name}"
    )

    return {"status": "created"}, 201

@bp.patch("/<pid>")
@require_role("admin", "editor")
def update_project(pid):
    payload = request.get_json(force=True, silent=True) or {}
    data = store.load()
    proj = next((p for p in data.projects if p.id == pid), None)
    if not proj:
        abort(404, "Project not found")

    before = proj.model_dump()
    for k, v in payload.items():
        setattr(proj, k, v)

    store.save(data)
    commit_yaml(f"chore(project): update {pid}")

    # ✅ Audit log entry
    record(
        actor=g.sub,
        resource="project",
        action="update",
        diff=f"Updated project {pid}:\nFrom: {before}\nTo: {proj.model_dump()}"
    )

    return {}, 204

@bp.delete("/<pid>")
@require_role("admin", "editor")
def delete_project(pid):
    data = store.load()
    target = next((p for p in data.projects if p.id == pid), None)
    if not target:
        abort(404, "Not found")

    data.projects = [p for p in data.projects if p.id != pid]
    store.save(data)
    commit_yaml(f"chore(project): delete {pid}")

    record(
        actor=g.sub,
        resource="project",
        action="delete",
        diff=f"Deleted project {pid}"
    )

    return {}, 204

@bp.post("/dry-run")
def diff_project_add():
    payload = request.get_json(force=True, silent=True) or {}
    try:
        proj = ProjectModel(**payload)
    except Exception as exc:
        abort(400, str(exc))

    before = store.load()
    after = before.model_copy(deep=True)
    after.projects.append(proj)
    return {"diff": unified_yaml_diff(before, after)}