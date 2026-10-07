# 🧠 Quiz Arena — Next.js full-stack practice project

A small quiz game that touches every layer of a full-stack app:

| Layer | Where |
|-------|-------|
| Frontend (React) | `app/page.js`, `app/globals.css` |
| Backend (API routes) | `app/api/questions/route.js`, `app/api/scores/route.js` |
| Data / "database" | `lib/db.js` (JSON file), `lib/questions.js` |

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## How it works

1. The browser calls `GET /api/questions` (correct answers are NOT sent).
2. The player answers each question.
3. The browser sends all answers to `POST /api/scores`.
4. The server calculates the score, saves it, and returns the result.
5. `GET /api/scores` returns the top 10 for the leaderboard.

## Practice tasks (do them in order)

1. **Easy – UI:** show a progress bar and highlight the chosen option.
2. **Easy – Content:** add 10 more questions in `lib/questions.js`.
3. **Easy – Frontend:** add a 15-second timer per question; skip when time runs out.
4. **Medium – Backend:** add `category` to questions and `GET /api/questions?category=css`.
5. **Medium – Validation:** reject duplicate names within 1 minute and invalid answer data in `POST /api/scores`.
6. **Medium – Database:** replace `lib/db.js` with SQLite (`better-sqlite3`), Prisma, or MongoDB.
7. **Hard – Auth:** add login/register (NextAuth.js) and store scores per user.
8. **Hard – Real-time:** make a 2-player room with WebSockets or Server-Sent Events.
9. **Hard – Admin:** create an `/admin` page to add/edit/delete questions.
10. **Deploy:** push to GitHub and deploy on Vercel (or Cloudflare).

## Project structure

```
quiz-arena/
├─ app/
│  ├─ layout.js
│  ├─ page.js            # game UI (client component)
│  ├─ globals.css
│  └─ api/
│     ├─ questions/route.js
│     └─ scores/route.js
├─ lib/
│  ├─ db.js
│  └─ questions.js
├─ data/scores.json      # created automatically
└─ package.json
```
"# quize" 
