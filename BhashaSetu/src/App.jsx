import { AppProvider } from './context/AppContext';
import { VoiceProvider } from './context/VoiceContext';
import { useRoute } from './lib/router';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import Toaster from './components/Toaster';
import Home from './pages/Home';
import LiveClass from './pages/LiveClass';
import Learn from './pages/Learn';
import Assess from './pages/Assess';
import Progress from './pages/Progress';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Lab from './pages/Lab';

const PAGES = {
  '/': Home,
  '/live': LiveClass,
  '/learn': Learn,
  '/assess': Assess,
  '/progress': Progress,
  '/resources': Resources,
  '/settings': Settings,
  '/lab': Lab,
};

function Shell() {
  const { path, query, navigate } = useRoute();
  const Page = PAGES[path] || Home;
  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>
      <Sidebar path={path} navigate={navigate} />
      <main id="main" className="app__main" tabIndex={-1}>
        <Page key={path} navigate={navigate} query={query} />
      </main>
      <BottomNav path={path} navigate={navigate} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <VoiceProvider>
        <Shell />
      </VoiceProvider>
    </AppProvider>
  );
}
