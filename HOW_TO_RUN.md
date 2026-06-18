# 🚀 How to Run AI Mock Interview Application

## 📋 Prerequisites

Before running the application, ensure you have:
- **Python 3.8+** installed on your system
- **Web browser** (Chrome, Firefox, Edge, or Safari)
- **VS Code** (optional, for Live Server extension)

---

## 🛠️ Installation & Setup

### Step 1: Navigate to Project Directory

```bash
cd c:\Users\hp\Desktop\ai-mock-interview
```

### Step 2: Set Up Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - **Windows (CMD):**
     ```bash
     venv\Scripts\activate
     ```
   - **Windows (PowerShell):**
     ```bash
     venv\Scripts\Activate.ps1
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Flask backend:**
   ```bash
   python app.py
   ```

   ✅ **Backend should now be running at:** `http://127.0.0.1:5000`

   You should see output like:
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   ```

---

### Step 3: Set Up Frontend

#### Option A: Using VS Code Live Server (Recommended)

1. **Open the project in VS Code**
2. **Install Live Server extension** (if not already installed):
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   - Search for "Live Server"
   - Click "Install"

3. **Start Live Server:**
   - Right-click on `frontend/index.html`
   - Select "Open with Live Server"
   - OR press `Alt+L Alt+O`

   ✅ **Frontend will open automatically in your browser at:** `http://127.0.0.1:5500/frontend/index.html`

#### Option B: Direct Browser Access

1. **Open your browser**
2. **Navigate to:**
   ```
   file:///c:/Users/hp/Desktop/ai-mock-interview/frontend/index.html
   ```
   
   ⚠️ **Note:** CORS issues may occur with direct file access. Live Server is recommended.

---

## 🎯 How to Use the Application

### 1. **Register/Login**
   - Open the frontend in your browser
   - Click "Register" tab
   - Enter your name, email, and password
   - Click "Register"
   - Switch to "Login" tab and log in with your credentials

### 2. **Start an Interview**
   - On the Dashboard, select:
     - **Interview Category** (Technical, Behavioral, Leadership, Problem Solving)
     - **Job Role** (Python Developer, Web Developer, etc.)
     - **Difficulty Level** (Easy, Medium, Hard)
   - Click "Start Interview"

### 3. **Answer Questions**
   - Read each question carefully
   - Click "💡 Show Hint" if you need guidance (optional)
   - Type your answer in the text area
   - The "Next Question →" button becomes enabled as you type
   - Click "Next Question →" to move to the next question
   - On the last question, click "✓ Submit Interview"

### 4. **View Results**
   - After submission, you'll be redirected to the **Scoreboard**
   - See your:
     - **Total Score**
     - **Average Score**
     - **Detailed feedback** for each question

### 5. **Check History**
   - Return to Dashboard
   - View **Performance Analytics** (Total Interviews, Avg Score, Best Score)
   - Click "View Details →" on any past interview to see full results

---

## 📁 Project Structure

```
ai-mock-interview/
├── backend/
│   ├── app.py              # Flask application entry point
│   ├── auth.py             # Authentication routes
│   ├── interview.py        # Interview routes
│   ├── models.py           # Database models
│   ├── ai_service.py       # AI mock service
│   ├── requirements.txt    # Python dependencies
│   └── mock_interview.db   # SQLite database (auto-created)
├── frontend/
│   ├── index.html          # Login/Register page
│   ├── dashboard.html      # Main dashboard
│   ├── interview.html      # Interview page
│   ├── results.html        # Scoreboard page
│   ├── history.html        # Interview history details
│   ├── app.js              # JavaScript logic
│   └── style.css           # Styling
└── README.md
```

---

## 🎨 Features

✅ **User Authentication** - Secure login/register system  
✅ **Interview Categories** - Technical, Behavioral, Leadership, Problem Solving  
✅ **Live Timer** - Track time spent on each question  
✅ **Progress Bar** - Visual progress indicator  
✅ **Smart Hints** - Category-specific tips for better answers  
✅ **Performance Analytics** - Track your improvement over time  
✅ **Scoreboard** - Beautiful results page with detailed feedback  
✅ **Interview History** - Review all past interviews  

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `python: command not found`  
**Solution:** Install Python from [python.org](https://www.python.org/downloads/)

**Problem:** `Module not found` errors  
**Solution:** Ensure virtual environment is activated and run:
```bash
pip install -r requirements.txt
```

**Problem:** Port 5000 already in use  
**Solution:** Kill the process using port 5000 or change port in `app.py`:
```python
create_app().run(debug=True, port=5001)
```

### Frontend Issues

**Problem:** CORS errors in browser console  
**Solution:** Use Live Server instead of opening file directly

**Problem:** API requests failing  
**Solution:** Ensure backend is running at `http://127.0.0.1:5000`

**Problem:** Live Server not working  
**Solution:** 
- Install Live Server extension in VS Code
- Right-click on `index.html` → Open with Live Server

---

## 🔧 Stopping the Application

### Stop Backend:
- Press `Ctrl+C` in the terminal where Flask is running

### Stop Frontend (Live Server):
- Click "Port: 5500" in VS Code status bar
- Or press `Alt+L Alt+C`

---

## 📝 Sample Answer for Full Score

**Question:** "Tell me about yourself for the role of Python Developer"

**High-Scoring Answer:**
```
I'm a Python Developer with 3+ years of experience building scalable web 
applications and data processing systems. I specialize in Django and Flask 
frameworks, and have strong expertise in RESTful API development, database 
optimization with PostgreSQL, and automated testing using pytest.

In my recent role, I developed a microservices-based e-commerce platform 
that handles 50,000+ daily transactions, reducing response time by 40% 
through efficient caching strategies and asynchronous task processing with 
Celery. I also implemented CI/CD pipelines using Docker and GitHub Actions.

I'm passionate about writing clean, maintainable code following PEP 8 
standards and SOLID principles. I actively contribute to open-source projects 
and stay updated with the latest Python ecosystem trends.
```

**Tips for full score:**
- Include quantifiable achievements
- Mention specific technologies
- Provide real-world examples
- Show continuous learning
- Keep answer 4-6 lines (150-180 words)

---

## 📞 Support

If you encounter any issues:
1. Check that both backend and frontend are running
2. Clear browser cache and localStorage
3. Restart both servers
4. Check browser console for errors (F12)

---

## 🎉 Enjoy Your Interview Practice!

Good luck with your mock interviews! 🚀
