from flask import Flask
from flask_cors import CORS
from utils.auth import parse_token

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])

    @app.before_request
    def auth_middleware():
        if request.path.startswith("/api/"):
            parse_token()

    # blueprint registration deferred to keep file short
    from routes.users import bp as users_bp
    from routes.projects import bp as projects_bp
    from routes.diff import bp as diff_bp
    
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(diff_bp, url_prefix="/api/diff")
    return app

if __name__ == "__main__":
    create_app().run(debug=True, port=8000)