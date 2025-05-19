from git import Repo
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

def commit_yaml(message: str):
    repo = Repo(REPO_ROOT)
    yaml_path = REPO_ROOT / "ansible/inv/SHARED/group_vars/project-users.yaml"
    repo.git.add(yaml_path)
    if repo.is_dirty(index=True):
        repo.index.commit(message)