# Voice Notes Manager App (MERN + GenAI)

A full-stack Voice Notes Manager built with the **MERN stack** and **GenAI integration**.  
Users can record voice notes, auto-transcribe them, edit/delete notes, and generate AI-powered summaries.

---

## Features

- **Record & Transcribe** – Record voice notes, automatically transcribed with OpenAI Whisper.
- **CRUD Operations** – Create, view, edit, and delete notes.
- **AI Summarization** – Generate concise summaries using GPT/Gemini.
- **Smart Logic** – Editing a transcript clears its summary until regenerated.
- **Persistence** – Notes stored in MongoDB (transcript + optional summary).
- **Deployment** – Backend on Render, Frontend on Vercel.

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios
- **Backend:** Node.js, Express.js, Multer
- **Database:** MongoDB (Mongoose)
- **GenAI APIs:** OpenAI Whisper (Speech-to-Text), GPT (Summarization)
- **Deployment:** Render (backend), Vercel (frontend)

---

## 📂 Folder Structure

```bash

voice-notes-app/
│── client/ # React frontend
│ └── src/
│ ├── components/ # Recorder, NoteCard, etc.
│ ├── pages/ # Home page
│ ├── services/ # API calls
│ ├── App.js
│ └── main.js
│
│── server/ # Express backend
│ └── src/
│ ├── config/db.js
│ ├── models/Note.js
│ ├── routes/notes.js
│ ├── controllers/noteController.js
│ ├── services/openaiService.js
│ ├── app.js
│ └── server.js
│
│── .env
│── README.md
```

---

## ⚡ Installation & Setup

### 1. Clone Repo
```bash
git clone https://github.com/ajaykumar-21/voice-note-manager.git
cd voice-notes-app
