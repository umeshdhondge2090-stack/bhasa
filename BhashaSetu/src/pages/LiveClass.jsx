import { LuArrowLeft, LuCheck, LuRotateCcw, LuCircleHelp } from 'react-icons/lu';
import { useVoice } from '../context/VoiceContext';
import { useApp } from '../context/AppContext';
import AvatarCompanion from '../components/avatar/AvatarCompanion';
import AudioWave from '../components/AudioWave';
import VoiceInteraction from '../components/VoiceInteraction';
import { SpeechCard, TranslationCard } from '../components/TranslationPanel';
import ActionDock from '../components/ActionDock';
import ProgressIndicator from '../components/ProgressIndicator';
import OfflineStatus from '../components/OfflineStatus';
import { bubbleFor } from './Home';

const STEPS = [{ label: 'Listening' }, { label: 'Translating' }, { label: 'Speaking' }];
const STEP_INDEX = { idle: -1, listening: 0, thinking: 1, speaking: 2, result: 3 };

/** Immersive live class: teacher speech -> voice -> character -> translation -> child response. */
export default function LiveClass({ navigate }) {
  const v = useVoice();
  const { klass } = useApp();
  const live = v.phase === 'listening' || v.phase === 'speaking';
  return (
    <div className="page live">
      <div className="live__stage">
        <span className="live__glow live__glow--a" aria-hidden="true" />
        <span className="live__glow live__glow--b" aria-hidden="true" />

        <div className="live__bar">
          <button className="live__back" onClick={() => navigate('/')} aria-label="Back to Home">
            <LuArrowLeft size={20} />
          </button>
          <div className="live__bar-title">
            <strong>Live Class</strong>
            <span>{klass}</span>
          </div>
          <OfflineStatus variant="chip" />
        </div>

        <div className="live__steps">
          <ProgressIndicator variant="steps" tone="dark" compact steps={STEPS} current={STEP_INDEX[v.phase]} />
        </div>

        <div className="live__grid">
          <div className="live__left">
            <div className="live__wave" style={{ order: 2 }}>
              <AudioWave active={live} bars={30} height={46} />
            </div>
            <div className="live__char" style={{ order: 3 }}>
              <AvatarCompanion state={v.avatarState} bubble={bubbleFor(v)} bubblePlacement="top" />
            </div>
            <div className="live__controls" style={{ order: 5 }}>
              <ActionDock theme="dark" actions={['repeat', 'slow', 'explain']} />
              <VoiceInteraction theme="dark" size="md" />
            </div>
          </div>

          <div className="live__right">
            <div style={{ order: 1 }}>
              <SpeechCard theme="dark" />
            </div>
            <div style={{ order: 4 }}>
              <TranslationCard theme="dark" />
            </div>
            <div className="live__child" style={{ order: 6 }}>
              <p className="eyebrow">Child's response</p>
              <div className="live__child-row">
                <button className="chip-btn chip-btn--good" onClick={() => v.markResponse('correct')}>
                  <LuCheck size={18} /> Correct
                </button>
                <button className="chip-btn" onClick={() => v.markResponse('incorrect')}>
                  <LuRotateCcw size={18} /> Try again
                </button>
                <button className="chip-btn" onClick={() => v.markResponse('unclear')}>
                  <LuCircleHelp size={18} /> Couldn't hear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
