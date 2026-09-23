# BhashaSetu - Hindi <-> Mundari / Santhali AI Classroom Companion

BhashaSetu is an offline-first AI translation and speech companion designed for classrooms bridging Hindi, Mundari, and Santhali languages.

## Features
- **Neural Machine Translation**: Fine-tuned mT5 model for bidirectional Hindi <-> Mundari / Santhali translation.
- **Phonetic Ol Chiki Support**: Transliteration and phonetic mapping for Ol Chiki script.
- **Neural Speech Engine**: Text-to-Speech (TTS) using neural voice models with browser fallback.
- **Interactive Classroom UI**: Modern React + Vite frontend with real-time translation and voice companion.
- **Offline Capable**: Standalone FastAPI server serving both API and the frontend without external cloud dependencies.

---

## Quick Start (Windows)

1. Double-click `run_app.bat` to launch the server and open the app in your browser at `http://127.0.0.1:8000`.

---

## Manual Setup

### 1. Prerequisites
- Python 3.11, 3.12, or 3.13 (with PyTorch support)
- Node.js (v18+) *(optional, only needed for frontend development)*

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Model Weights
Place the fine-tuned `model.safetensors` file into the `Hindi_Mundari_MT5/` folder.

### 4. Run the Application
```bash
python server.py
# Or if you have multiple Python versions:
py -3.13 server.py
```
Open your browser at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## Frontend Development (Optional)

If modifying the React UI with hot-reloading:
```bash
cd BhashaSetu
npm install
npm run dev
```

To build production assets:
```bash
cd BhashaSetu
npm run build
```
The FastAPI backend serves the production build directly from `BhashaSetu/dist`.
