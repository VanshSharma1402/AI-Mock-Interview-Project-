# AI Mock Interview System (Flask + SQLite)

## Run Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend runs on: http://127.0.0.1:5000

## API Endpoints
- POST `/api/register`
- POST `/api/login`
- POST `/api/start`
- POST `/api/answer`
- GET  `/api/history/<user_id>`
- GET  `/api/session/<session_id>`

## Notes
This version uses a mock AI logic so it works without any API key.
You can later connect Gemini/OpenAI inside `ai_service.py`.
