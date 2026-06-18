const API = "http://127.0.0.1:5000/api";

function qs(id){ return document.getElementById(id); }
function getUser(){
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch(e){ return null; }
}
function setUser(u){ localStorage.setItem("user", JSON.stringify(u)); }
function logout(){ localStorage.removeItem("user"); window.location.href="index.html"; }

async function post(url, data){
  const res = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
  const out = await res.json().catch(()=> ({}));
  if(!res.ok) throw new Error(out.error || "Request failed");
  return out;
}
async function get(url){
  const res = await fetch(url);
  const out = await res.json().catch(()=> ([]));
  if(!res.ok) throw new Error("Request failed");
  return out;
}

// INDEX (login/register)
async function handleRegister(){
  const name = qs("r_name").value.trim();
  const email = qs("r_email").value.trim();
  const password = qs("r_pass").value.trim();
  const msg = qs("msg");
  msg.textContent = "";
  try{
    await post(`${API}/register`, {name,email,password});
    msg.textContent = "Registered! Now login.";
  }catch(e){ msg.textContent = e.message; }
}

async function handleLogin(){
  const email = qs("l_email").value.trim();
  const password = qs("l_pass").value.trim();
  const msg = qs("msg");
  msg.textContent = "";
  try{
    const out = await post(`${API}/login`, {email,password});
    setUser({ user_id: out.user_id, name: out.name });
    window.location.href = "dashboard.html";
  }catch(e){ msg.textContent = e.message; }
}

// DASHBOARD
async function startInterview(){
  const user = getUser();
  if(!user) return (window.location.href="index.html");
  const category = qs("category").value;
  const role = qs("role").value;
  const difficulty = qs("difficulty").value;
  const msg = qs("dmsg");
  msg.textContent = "";
  try{
    const out = await post(`${API}/start`, { user_id: user.user_id, role, difficulty });
    localStorage.setItem("session_id", out.session_id);
    localStorage.setItem("questions", JSON.stringify(out.questions));
    localStorage.setItem("category", category);
    window.location.href = "interview.html";
  }catch(e){ msg.textContent = e.message; }
}

async function loadHistory(){
  const user = getUser();
  if(!user) return;
  const box = qs("historyBox");
  box.innerHTML = "";
  try{
    const sessions = await get(`${API}/history/${user.user_id}`);
    if(!sessions.length){
      box.innerHTML = `<div class="item">No interviews yet. Start your first one.</div>`;
      updateAnalytics([]);
      return;
    }
    sessions.forEach(s=>{
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="row">
          <div><b>${s.role}</b> <span class="badge">${s.difficulty}</span></div>
          <div style="text-align:right;"><b>Score:</b> ${s.total_score}</div>
        </div>
        <div class="small">${new Date(s.created_at).toLocaleString()}</div>
        <div style="margin-top:8px;">
          <a class="link" href="history.html?session_id=${s.session_id}">View Details →</a>
        </div>
      `;
      box.appendChild(div);
    });
    updateAnalytics(sessions);
  }catch(e){
    box.innerHTML = `<div class="item">Error loading history: ${e.message}</div>`;
  }
}

function updateAnalytics(sessions){
  const total = sessions.length;
  const scores = sessions.map(s => s.total_score || 0);
  const avg = total > 0 ? Math.round(scores.reduce((a,b)=>a+b,0) / total) : 0;
  const best = total > 0 ? Math.max(...scores) : 0;
  
  if(qs("totalInterviews")) qs("totalInterviews").textContent = total;
  if(qs("avgScore")) qs("avgScore").textContent = avg;
  if(qs("bestScore")) qs("bestScore").textContent = best;
}

// INTERVIEW
function loadInterview(){
  const user = getUser();
  if(!user) return (window.location.href="index.html");

  const questions = JSON.parse(localStorage.getItem("questions") || "[]");
  const sessionId = localStorage.getItem("session_id");
  if(!questions.length || !sessionId) return (window.location.href="dashboard.html");

  window.__questions = questions;
  window.__answers = new Array(questions.length).fill("");
  window.__idx = 0;
  window.__timerSeconds = 0;
  window.__timerInterval = null;
  qs("qCount").textContent = `${questions.length}`;
  showQuestion();
  startTimer();
}

function showQuestion(){
  const q = window.__questions[window.__idx];
  qs("qText").textContent = q;
  qs("qNo").textContent = `${window.__idx + 1}`;
  qs("answer").value = window.__answers[window.__idx] || "";
  qs("messageBox").innerHTML = "";
  
  // Show/hide appropriate buttons
  const isLastQuestion = window.__idx === window.__questions.length - 1;
  if(isLastQuestion){
    qs("nextBtn").style.display = "none";
    qs("submitBtn").style.display = "inline-block";
    qs("submitBtn").disabled = window.__answers[window.__idx].trim() === "";
    qs("submitBtn").style.opacity = window.__answers[window.__idx].trim() === "" ? "0.5" : "1";
  }else{
    qs("nextBtn").style.display = "inline-block";
    qs("submitBtn").style.display = "none";
    qs("nextBtn").disabled = window.__answers[window.__idx].trim() === "";
    qs("nextBtn").style.opacity = window.__answers[window.__idx].trim() === "" ? "0.5" : "1";
    qs("nextBtn").textContent = "Next Question →";
  }
  
  updateProgressBar();
  resetTimer();
  updateHintContent();
}

function enableNextButton(){
  const answer = qs("answer").value.trim();
  const isLastQuestion = window.__idx === window.__questions.length - 1;
  
  if(isLastQuestion){
    qs("submitBtn").disabled = answer === "";
    qs("submitBtn").style.opacity = answer === "" ? "0.5" : "1";
  }else{
    qs("nextBtn").disabled = answer === "";
    qs("nextBtn").style.opacity = answer === "" ? "0.5" : "1";
  }
}

async function submitAnswer(){
  const session_id = parseInt(localStorage.getItem("session_id"), 10);
  const question = window.__questions[window.__idx];
  const answer = qs("answer").value.trim();

  if(!answer){ qs("messageBox").innerHTML = `<div class="item">Please write your answer first.</div>`; return; }

  qs("submitBtn").disabled = true;
  qs("answer").disabled = true;
  qs("messageBox").innerHTML = `<div class="item">Checking your answer...</div>`;

  try{
    const out = await post(`${API}/answer`, { session_id, question, answer });
    qs("messageBox").innerHTML = `
      <div class="item" style="background: rgba(0,255,0,0.1); border-left: 3px solid #4ade80;">
        <div><b>Score:</b> ${out.score}/10</div>
        <div style="margin-top:6px; color:#cfe5ff;"><b>Feedback:</b> ${out.feedback}</div>
      </div>
    `;
    qs("nextBtn").disabled = false;
    qs("nextBtn").style.opacity = "1";
    qs("nextBtn").focus();
  }catch(e){
    qs("messageBox").innerHTML = `<div class="item">Error: ${e.message}</div>`;
    qs("submitBtn").disabled = false;
    qs("answer").disabled = false;
  }
}

function nextQuestion(){
  const answer = qs("answer").value.trim();
  
  if(!answer){
    qs("messageBox").innerHTML = `<div class="item">Please write your answer first.</div>`;
    return;
  }
  
  // Save current answer
  window.__answers[window.__idx] = answer;
  
  // Move to next question
  if(window.__idx < window.__questions.length - 1){
    window.__idx += 1;
    showQuestion();
  }
}

async function submitAllAnswers(){
  const answer = qs("answer").value.trim();
  
  if(!answer){
    qs("messageBox").innerHTML = `<div class="item">Please write your answer first.</div>`;
    return;
  }
  
  // Save last answer
  window.__answers[window.__idx] = answer;
  
  // Check if all answers are filled
  const unanswered = window.__answers.findIndex(a => !a.trim());
  if(unanswered !== -1){
    qs("messageBox").innerHTML = `<div class="item">Please answer question ${unanswered + 1} before submitting.</div>`;
    return;
  }
  
  qs("submitBtn").disabled = true;
  qs("answer").disabled = true;
  qs("messageBox").innerHTML = `<div class="item">Submitting all answers and calculating scores...</div>`;
  
  const session_id = parseInt(localStorage.getItem("session_id"), 10);
  const results = [];
  
  try{
    // Submit all answers
    for(let i = 0; i < window.__questions.length; i++){
      const out = await post(`${API}/answer`, { 
        session_id, 
        question: window.__questions[i], 
        answer: window.__answers[i] 
      });
      results.push({
        question: window.__questions[i],
        answer: window.__answers[i],
        score: out.score,
        feedback: out.feedback
      });
    }
    
    // Store results and redirect to scoreboard
    localStorage.setItem("interview_results", JSON.stringify(results));
    localStorage.removeItem("questions");
    localStorage.removeItem("session_id");
    localStorage.removeItem("category");
    stopTimer();
    window.location.href = "results.html";
    
  }catch(e){
    qs("messageBox").innerHTML = `<div class="item">Error: ${e.message}</div>`;
    qs("submitBtn").disabled = false;
    qs("answer").disabled = false;
  }
}

// TIMER FUNCTIONS
function startTimer(){
  if(window.__timerInterval) clearInterval(window.__timerInterval);
  window.__timerInterval = setInterval(()=>{
    window.__timerSeconds++;
    const mins = Math.floor(window.__timerSeconds / 60);
    const secs = window.__timerSeconds % 60;
    qs("timer").textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }, 1000);
}

function resetTimer(){
  window.__timerSeconds = 0;
  qs("timer").textContent = "00:00";
}

function stopTimer(){
  if(window.__timerInterval){
    clearInterval(window.__timerInterval);
    window.__timerInterval = null;
  }
}

// PROGRESS BAR
function updateProgressBar(){
  const progress = ((window.__idx + 1) / window.__questions.length) * 100;
  qs("progressBar").style.width = `${progress}%`;
}

// HINT SYSTEM
function toggleHint(){
  const content = qs("hintContent");
  const btn = qs("hintBtn");
  if(content.style.display === "none"){
    content.style.display = "block";
    btn.textContent = "💡 Hide Hint";
  }else{
    content.style.display = "none";
    btn.textContent = "💡 Show Hint";
  }
}

function updateHintContent(){
  const category = localStorage.getItem("category") || "technical";
  const hints = {
    technical: "Break down your answer into: 1) Concept explanation, 2) Real-world example, 3) Best practices. Use technical terms accurately.",
    behavioral: "Use the STAR method: Situation (context), Task (your responsibility), Action (what you did), Result (outcome with metrics).",
    leadership: "Focus on: Team impact, decision-making process, conflict resolution, and measurable outcomes. Show emotional intelligence.",
    problemsolving: "Explain your approach: 1) Understand the problem, 2) Consider alternatives, 3) Choose solution, 4) Implement, 5) Evaluate results."
  };
  qs("hintText").textContent = hints[category] || hints.technical;
  qs("hintContent").style.display = "none";
  qs("hintBtn").textContent = "💡 Show Hint";
}

// RESULTS PAGE
function loadResults(){
  const results = JSON.parse(localStorage.getItem("interview_results") || "[]");
  
  if(!results.length){
    window.location.href = "dashboard.html";
    return;
  }
  
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const avgScore = Math.round(totalScore / results.length);
  
  qs("totalScore").textContent = totalScore;
  qs("questionsCount").textContent = results.length;
  qs("avgScore").textContent = avgScore;
  
  const box = qs("resultsBox");
  box.innerHTML = "";
  
  results.forEach((r, i) => {
    const scoreColor = r.score >= 8 ? "#4ade80" : r.score >= 5 ? "#fbbf24" : "#f87171";
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="row" style="align-items:center;">
        <div class="badge">Q${i+1}</div>
        <div style="text-align:right;">
          <span style="font-size:20px; font-weight:800; color:${scoreColor};">${r.score}/10</span>
        </div>
      </div>
      <div style="margin-top:8px;"><b>Question:</b> ${r.question}</div>
      <div style="margin-top:6px;"><b>Your Answer:</b> ${r.answer}</div>
      <div style="margin-top:8px; padding:10px; background:rgba(90,167,255,0.08); border-left:3px solid #5aa7ff; border-radius:6px;">
        <div style="color:#cfe5ff;"><b>💬 Feedback:</b> ${r.feedback}</div>
      </div>
    `;
    box.appendChild(div);
  });
  
  // Clear results from localStorage after displaying
  setTimeout(() => {
    localStorage.removeItem("interview_results");
  }, 100);
}

// HISTORY DETAILS
async function loadSessionDetails(){
  const params = new URLSearchParams(window.location.search);
  const session_id = params.get("session_id");
  const box = qs("sessionBox");
  box.innerHTML = "";
  if(!session_id){ box.innerHTML = `<div class="item">No session selected.</div>`; return; }

  try{
    const answers = await get(`${API}/session/${session_id}`);
    if(!answers.length){
      box.innerHTML = `<div class="item">No answers found.</div>`;
      return;
    }
    answers.forEach((a, i)=>{
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="small">Q${i+1}</div>
        <div><b>Question:</b> ${a.question}</div>
        <div style="margin-top:6px;"><b>Your Answer:</b> ${a.answer}</div>
        <div style="margin-top:6px; color:#cfe5ff;"><b>Feedback:</b> ${a.feedback}</div>
        <div style="margin-top:6px;"><b>Score:</b> ${a.score}/10</div>
      `;
      box.appendChild(div);
    });
  }catch(e){
    box.innerHTML = `<div class="item">Error: ${e.message}</div>`;
  }
}
