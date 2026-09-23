import { useEffect, useRef, useState } from 'react';
import { LuDownload, LuCheck, LuPrinter } from 'react-icons/lu';
import { PageHeader } from '../components/Header';
import { WordArt } from '../components/Illustrations';
import ProgressIndicator from '../components/ProgressIndicator';
import { useApp } from '../context/AppContext';
import { DOWNLOADS, WORDS } from '../data/content';
import { load, save } from '../lib/storage';

/**
 * Content packs. Download progress is simulated in demo mode -
 * connect this to your real content-sync API when it is ready.
 */
export default function Resources() {
  const { toast } = useApp();
  const [state, setState] = useState(() => load('bs.downloads', { b1: 100, r1: 100 }));
  const timers = useRef({});
  useEffect(() => save('bs.downloads', state), [state]);
  useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);

  const download = (item) => {
    if (timers.current[item.id]) return;
    setState((s) => ({ ...s, [item.id]: 4 }));
    timers.current[item.id] = setInterval(() => {
      setState((s) => {
        const next = Math.min(100, (s[item.id] || 0) + 9 + Math.random() * 8);
        if (next >= 100) {
          clearInterval(timers.current[item.id]);
          delete timers.current[item.id];
          toast(`${item.title} is ready offline`, 'success');
        }
        return { ...s, [item.id]: Math.round(next) };
      });
    }, 260);
  };

  const [topic, setTopic] = useState('all');
  const words = topic === 'all' ? WORDS : WORDS.filter((w) => w.id === topic);
  const groups = [...new Set(DOWNLOADS.map((d) => d.group))];

  return (
    <div className="page resources-page">
      <PageHeader title="Resources" subtitle="Download once, teach anywhere — even without internet" />
      <div className="rp__grid">
        <section className="surface rp__downloads">
          {groups.map((g) => (
            <div key={g} className="rp__group">
              <h2 className="eyebrow">{g}</h2>
              <ul>
                {DOWNLOADS.filter((d) => d.group === g).map((d) => {
                  const pct = state[d.id] || 0;
                  return (
                    <li key={d.id}>
                      <div className="rp__meta">
                        <b className="hi">{d.title}</b>
                        <small>{d.sub} • {d.mb} MB</small>
                        {pct > 0 && pct < 100 && <ProgressIndicator variant="bar" value={pct} />}
                      </div>
                      {pct >= 100 ? (
                        <span className="ready"><LuCheck size={16} /> Available offline</span>
                      ) : (
                        <button className="btn btn--ghost" onClick={() => download(d)} disabled={pct > 0}>
                          <LuDownload size={18} /> {pct > 0 ? `${pct}%` : 'Download'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section className="surface rp__worksheet">
          <div className="rp__ws-head">
            <h2 className="panel__title">Create worksheet</h2>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Worksheet topic">
              <option value="all">All words</option>
              {WORDS.map((w) => <option key={w.id} value={w.id}>{w.hi} • {w.en}</option>)}
            </select>
          </div>
          <div className="worksheet" id="worksheet">
            <h3>Nature Around Us — Name the picture</h3>
            <p className="worksheet__name">Name: ______________ &nbsp; Class: ____</p>
            <ol>
              {words.map((w) => (
                <li key={w.id}>
                  <WordArt id={w.id} size={64} />
                  <span className="worksheet__line" />
                </li>
              ))}
            </ol>
          </div>
          <button className="btn btn--primary" onClick={() => window.print()}><LuPrinter size={19} /> Print worksheet</button>
        </section>
      </div>
    </div>
  );
}
