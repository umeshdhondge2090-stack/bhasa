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

## Deploy to Vercel

The project is pre-configured with `vercel.json` for one-click deployment on [Vercel](https://vercel.com):

### Option A: Automatic Import (Default)
1. Push your repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." -> "Project"**.
3. Import your `bhasa` repository.
4. Keep all default build settings (they are automatically detected from `vercel.json`).
5. Click **Deploy**.

### Option B: Deploying with Root Directory set to `BhashaSetu`
1. If you configure Vercel with **Root Directory** set to `BhashaSetu` in project settings, it will also build automatically using `BhashaSetu/vercel.json`.

### Connecting a Live Model Backend on Vercel (Optional)
By default, the deployed Vercel site runs in offline/interactive classroom mode with built-in curriculum, vocabulary, and browser voice synthesis. If you have deployed the FastAPI mT5 backend (e.g. on Hugging Face Spaces or Render), add the following environment variable in your Vercel Project Settings:

- **Key**: `VITE_API_BASE`
- **Value**: `https://<your-space-name>.hf.space/api` (or your backend URL)

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
