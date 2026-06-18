"""AI service layer.

This project ships with a MOCK provider so it works offline for college demos.
Later, you can replace generate_questions() and evaluate_answer() with Gemini/OpenAI calls.
"""

def generate_questions(role: str, difficulty: str = "easy"):
    base = {
        "easy": [
            f"Tell me about yourself for the role of {role}.",
            f"What are your strengths and weaknesses as a {role}?",
            f"Explain a project you built related to {role}.",
            f"Why should we hire you as a {role}?",
            f"What is your biggest learning till now?"
        ],
        "medium": [
            f"Explain one challenging bug you solved in {role} related work.",
            f"How do you handle pressure and deadlines?",
            f"Describe a situation where you worked in a team.",
            f"What is your approach to problem solving?",
            f"What will you improve in your next project?"
        ],
        "hard": [
            f"Walk me through how you would design a scalable solution as a {role}.",
            f"Tell about a time you failed and what you learned from it.",
            f"How do you measure quality in your work? Give example.",
            f"Explain trade-offs you made in a recent project.",
            f"If hired, what will be your 30-day plan as a {role}?"
        ],
    }
    return base.get(difficulty, base["easy"])

def evaluate_answer(question: str, answer: str):
    # Simple scoring logic: based on answer length + small heuristics.
    ans = (answer or "").strip()
    answer_len = len(ans)

    score = 2
    if answer_len > 40: score = 5
    if answer_len > 90: score = 7
    if answer_len > 150: score = 9
    if answer_len > 230: score = 10

    feedback = []
    if answer_len < 40:
        feedback.append("Your answer is too short, try explain more with example.")
    if "because" not in ans.lower():
        feedback.append("Add reasons like 'because' to sound more confident.")
    if len(ans.split()) < 15:
        feedback.append("Try to add more details (skills, tools, results).")
    feedback.append("Keep structure: Situation → Action → Result. And speak calmly.")

    return score, " ".join(feedback)
