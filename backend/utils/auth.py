import os, functools
from jose import jwt
from flask import request, g, abort

PUBLIC_KEY = os.getenv("CLERK_JWT_PUBLIC_KEY")
ALG = "RS256"

def parse_token():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        abort(401, "Missing bearer token")
    token = auth.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=[ALG])
    except Exception as e:
        abort(401, f"JWT invalid: {e}")

    # 🧠 Final universal casing patch
    role = payload.get("publicMetadata", {}).get("role") \
        or payload.get("public_metadata", {}).get("role") \
        or "viewer"

    biz_id = payload.get("publicMetadata", {}).get("bizId") \
        or payload.get("public_metadata", {}).get("biz_id")

    g.sub = payload["sub"]
    g.role = role
    g.biz_id = biz_id

    return payload

def require_role(*allowed):
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **kw):
            parse_token()
            if g.role not in allowed:
                abort(403, "Insufficient role")
            return fn(*a, **kw)
        return wrapper
    return deco