import difflib, yaml
from typing import Any

def _dump(obj: Any) -> list[str]:
    """Serialize model -> YAML lines (stripped of trailing \n)."""
    return yaml.safe_dump(
        obj.model_dump(mode="python"), sort_keys=False, indent=2
    ).splitlines(keepends=True)

def unified_yaml_diff(before, after) -> str:
    return "".join(
        difflib.unified_diff(
            _dump(before),
            _dump(after),
            fromfile="before.yaml",
            tofile="after.yaml",
        )
    )