from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from models import db
from auth import auth_bp
from interview import interview_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mock_interview.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(auth_bp)
    app.register_blueprint(interview_bp)

    @app.get("/")
    def home():
        return {"status": "ok", "message": "AI Mock Interview Backend Running"}

    return app

if __name__ == "__main__":
    create_app().run(debug=True, port=5000)
