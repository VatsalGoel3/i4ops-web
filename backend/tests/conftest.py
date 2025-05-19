import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import os, tempfile, shutil, json, pytest
from app import create_app
from services import project_store

@pytest.fixture(scope="session")
def tmp_yaml():
    tmpdir = tempfile.mkdtemp()
    path = Path(tmpdir) / "project-users.yaml"
    path.write_text(
        """i4ops_customer:
  biz_id: TEST-1
  shortname: test
  pretty_name: "pytest"
users: []
"""
    )
    # override env for the duration of the session
    os.environ["I4OPS_YAML_PATH"] = str(path)
    project_store.store.path = Path(path)  # make the singleton use temp file
    yield path
    shutil.rmtree(tmpdir)
    os.environ.pop("I4OPS_YAML_PATH", None)

@pytest.fixture()
def client(tmp_yaml):
    app = create_app()
    app.config["TESTING"] = True
    return app.test_client()