# Johar — classroom companion UI

Offline-first Hindi <-> Mundari classroom companion. React + Vite, no UI framework: plain CSS design tokens,
inline SVG illustrations and a fully original SVG character. Only runtime dependencies: react, react-dom, react-icons.

## Run

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/

Double-click `BhashaSetu-preview.html` for an instant offline preview (no install needed).

## Structure

    src/
      components/avatar/   AvatarCompanion + avatarConfig (the 9 expression states)
      components/scene/    ClassroomScene (SVG)
      components/          VoiceInteraction, TranslationPanel, ActionDock, OfflineStatus, QuickActions,
                           LessonCard, ResourceSection, ProgressIndicator, Sidebar, BottomNav, Header, Toaster...
      context/             AppContext (class, direction, prefs, toasts) + VoiceContext (phase + avatar state machine)
      services/engine.js   THE ONLY FILE TO CONNECT TO YOUR REAL BACKEND / ON-DEVICE MODELS
      pages/               Home, LiveClass, Learn, Assess, Progress, Resources, Settings, Lab
      styles/              tokens, layout, components, pages

## Character states

`<AvatarCompanion state="idle | listening | thinking | speaking | happy | encouraging | excited | success | confused" />`

Preview all of them at `#/lab`. Edit expressions/gestures in `components/avatar/avatarConfig.js`.
`VoiceContext` drives the state from the voice flow: idle -> listening -> thinking -> speaking -> result,
and `markResponse('correct' | 'incorrect' | 'unclear')` triggers happy / encouraging / confused.

## Connecting real translation

Everything runs in demo mode on sample phrases (`src/data/content.js`). Replace `engine.nextUtterance()`
(speech -> text -> translation) and `engine.speak()` (text-to-speech) in `src/services/engine.js`.
The Mundari sample text is placeholder content: have a native speaker verify it.

## Fonts

Uses system fonts (Nirmala UI on Windows covers Devanagari and Ol Chiki). For Android / other devices,
bundle Noto Sans Devanagari and Noto Sans Ol Chiki (e.g. via @fontsource) so they work offline everywhere.
