 QueryAI - Conversational BI Dashboard system 

QueryAI is an AI-powered platform that enables non-technical users to query databases using natural language. 
Instead of writing complex SQL queries, users can simply type questions in plain English and get accurate results instantly.
The system bridges the gap between human language and structured data, making analytics accessible to everyone.
 
 System Architecture
 Flow Overview
1. User enters a query in natural language
2. Frontend sends request to backend API
3. Backend processes prompt using AI model
4. AI converts prompt into SQL query
5. Query executes on database
6. Results are returned and displayed

 
Architecture Pipeline
User
  ↓
Frontend (Next.js)
  ↓
FastAPI Backend
  ↓
LLM (Gemini)
  ↓
SQL Generator
  ↓
Database (SQLite)
  ↓
Response generate Charts and summary 

Tech Stack
Frontend: Next.JS
Backend: FastAPI
AI Model: Gemini / OpenAI
Database: SQLite
Libraries: Pandas

Installation & Setup
Clone Repo
git clone <your-repo-link>
cd query-ai
Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend Setup
cd frontend
npm install
npm run dev

Conclusion
QueryAI transforms how users interact with data by making database querying as simple as asking a question.
