from flask import Blueprint, jsonify
from services.project_store import store

bp = Blueprint("projects", __name__)

@bp.get("/")
def list_projects():
    data = store.load()
    return jsonify(data.i4ops_customer)