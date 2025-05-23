from flask import Flask, request
from flask_cors import CORS
from utils.auth import parse_token
from prometheus_client import Counter, Histogram, generate_latest

# Prometheus metrics
REQ_LAT = Histogram("http_latency_seconds", "API latency", ["endpoint"])
REQ_CNT = Counter("http_requests_total", "API hits", ["endpoint", "status"])

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])

    @app.before_request
    def auth_middleware():
        if request.path.startswith("/api/"):
            parse_token()

    @app.after_request
    def observe(resp):
        ep = request.endpoint or "unknown"
        REQ_CNT.labels(ep, resp.status_code).inc()
        return resp

    @app.route("/metrics")
    def metrics():
        return generate_latest(), 200, {"Content-Type": "text/plain"}

    # Blueprint registration
    from routes.users import bp as users_bp
    from routes.projects import bp as projects_bp
    from routes.diff import bp as diff_bp

    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(diff_bp, url_prefix="/api/diff")
    
    return app

if __name__ == "__main__":
    create_app().run(debug=True, port=8000)