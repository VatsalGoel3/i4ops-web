from flask import Flask
from flask_cors import CORS

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])

    # blueprint registration deferred to keep file short
    from routes.users import bp as users_bp
    from routes.projects import bp as projects_bp
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    return app

if __name__ == "__main__":
    create_app().run(debug=True, port=8000)