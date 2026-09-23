import { useVoice } from '../context/VoiceContext';
import { HomeHeader } from '../components/Header';
import ClassroomScene from '../components/scene/ClassroomScene';
import AvatarCompanion from '../components/avatar/AvatarCompanion';
import VoiceInteraction from '../components/VoiceInteraction';
import { SpeechCard, TranslationCard } from '../components/TranslationPanel';
import ActionDock from '../components/ActionDock';
import ResourceSection from '../components/ResourceSection';
import OfflineStatus from '../components/OfflineStatus';
import LessonCard from '../components/LessonCard';
import QuickActions from '../components/QuickActions';

export function bubbleFor(v) {
  if (v.overrideText) return v.overrideText;
  if (v.avatarState === 'speaking') return v.dstWords.join(' ') || undefined;
  return undefined;
}

function Quote() {
  return (
    <section className="quote" aria-label="Johar message">
      <span className="quote__mark" aria-hidden="true">“</span>
      <p>Language is not a barrier, it's a bridge.</p>
      <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 70 Q60 30 120 62 Q190 20 250 58 Q290 44 320 60 L320 110 L0 110Z" fill="#9CCBF5" />
        <path d="M0 88 Q70 56 140 82 Q220 52 320 84 L320 110 L0 110Z" fill="#5AA7EA" />
        <path d="M0 100 Q90 78 170 98 Q250 80 320 98 L320 110 L0 110Z" fill="#0069D9" />
        <g transform="translate(262 34)">
          <path d="M0 52 C-18 38 -12 22 0 14 C12 22 18 38 0 52Z" fill="#16A36A" />
          <path d="M0 52 L0 28" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
          <path d="M0 50 C14 44 26 40 34 28 C24 24 8 30 0 50Z" fill="#00AEEF" opacity=".9" />
        </g>
      </svg>
    </section>
  );
}

export default function Home({ navigate }) {
  const v = useVoice();
  return (
    <div className="page home">
      <HomeHeader />
      <div className="home__grid">
        <div className="home__main">
          <section className="hero" aria-label="Classroom companion">
            <ClassroomScene className="hero__scene" />
            <div className="hero__char">
              <AvatarCompanion state={v.avatarState} bubble={bubbleFor(v)} />
            </div>
          </section>

          <section className="voice-panel surface" aria-label="Speak and translate">
            <SpeechCard />
            <VoiceInteraction />
            <TranslationCard />
            <div className="voice-panel__dock">
              <ActionDock />
            </div>
          </section>

          <ResourceSection navigate={navigate} />
        </div>

        <aside className="home__side" aria-label="Class information">
          <OfflineStatus variant="card" />
          <LessonCard navigate={navigate} />
          <QuickActions navigate={navigate} />
          <Quote />
        </aside>
      </div>
    </div>
  );
}
