from pathlib import Path
import os, fcntl, contextlib
import yaml
from pydantic import BaseModel, Field, ValidationError
from typing import List

DEFAULT_PATH = Path(__file__).resolve().parents[2] / "ansible/inv/SHARED/group_vars/project-users.yaml"
YAML_PATH = Path(os.getenv("I4OPS_YAML_PATH", DEFAULT_PATH))

class UserModel(BaseModel):
    username: str
    email: str
    role: str = Field(pattern="^(viewer|editor|admin)$")
    password_hash: str

class ProjectUsersModel(BaseModel):
    i4ops_customer: dict
    users: List[UserModel] = []

class ProjectStore:
    def __init__(self, path: Path):
        self.path = path

    def load(self) -> ProjectUsersModel:
        raw = {} if not self.path.exists() else yaml.safe_load(self.path.read_text())
        return ProjectUsersModel.model_validate(raw or {"i4ops_customer": {}, "users": []})

    def save(self, data: ProjectUsersModel):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("w") as fp, contextlib.closing(fp):
            fcntl.flock(fp, fcntl.LOCK_EX)
            yaml.safe_dump(data.model_dump(mode="python"), fp, sort_keys=False)
            fcntl.flock(fp, fcntl.LOCK_UN)

store = ProjectStore(YAML_PATH)