from flask import Blueprint, request, jsonify
from models import db, InterviewSession, InterviewAnswer
from ai_service import generate_questions, evaluate_answer

interview_bp = Blueprint("interview", __name__, url_prefix="/api")

@interview_bp.post("/start")
def start():
    data = request.get_json(force=True)
    user_id = data.get("user_id")
    role = (data.get("role") or "").strip()
    difficulty = (data.get("difficulty") or "easy").strip().lower()

    if not user_id or not role:
        return jsonify({"error": "user_id and role required"}), 400

    session = InterviewSession(user_id=user_id, role=role, difficulty=difficulty)
    db.session.add(session)
    db.session.commit()

    questions = generate_questions(role, difficulty)
    return jsonify({"session_id": session.id, "questions": questions}), 201

@interview_bp.post("/answer")
def answer():
    data = request.get_json(force=True)
    session_id = data.get("session_id")
    question = (data.get("question") or "").strip()
    answer_text = (data.get("answer") or "").strip()

    if not session_id or not question or not answer_text:
        return jsonify({"error": "session_id, question, answer required"}), 400

    score, feedback = evaluate_answer(question, answer_text)

    ans = InterviewAnswer(
        session_id=session_id,
        question=question,
        answer=answer_text,
        feedback=feedback,
        score=score
    )
    db.session.add(ans)

    # Update total score
    session = InterviewSession.query.get(session_id)
    session.total_score = (session.total_score or 0) + score

    db.session.commit()
    return jsonify({"score": score, "feedback": feedback}), 200

@interview_bp.get("/history/<int:user_id>")
def history(user_id):
    sessions = (InterviewSession.query
                .filter_by(user_id=user_id)
                .order_by(InterviewSession.id.desc())
                .all())
    out = []
    for s in sessions:
        out.append({
            "session_id": s.id,
            "role": s.role,
            "difficulty": s.difficulty,
            "total_score": s.total_score,
            "created_at": s.created_at.isoformat()
        })
    return jsonify(out), 200

@interview_bp.get("/session/<int:session_id>")
def session_detail(session_id):
    answers = InterviewAnswer.query.filter_by(session_id=session_id).order_by(InterviewAnswer.id.asc()).all()
    out = []
    for a in answers:
        out.append({
            "question": a.question,
            "answer": a.answer,
            "feedback": a.feedback,
            "score": a.score,
            "created_at": a.created_at.isoformat()
        })
    return jsonify(out), 200
