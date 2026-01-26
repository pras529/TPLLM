# 🚦 TPLLM — Flask + React

Simple traffic prediction dashboard with a Flask backend and React (Vite) frontend.

## Project Structure

- api/ — Flask API with `/predict` and `/health`
- public/ — Static assets (logo)
- src/ — React components and styles
- package.json — Vite-powered frontend scripts

## Getting Started

### Backend (Flask)
1. `cd api`
2. `python -m venv .venv && .venv\Scripts\activate` (Windows)
3. `pip install -r requirements.txt`
4. `python app.py` (runs on http://localhost:5000)

### Frontend (React + Vite)
1. Install Node.js 18+
2. From project root: `npm install`
3. `npm run dev` (runs on http://localhost:3000)

The React app calls the Flask API at `http://localhost:5000/predict` by default. Override with `VITE_API_BASE` in a `.env` file if needed.

## Deployment Notes
- Keep Flask and React served separately or proxy `/predict` during production.
- Update CORS settings in `api/app.py` if you restrict origins.

## License
MIT License
