import { LuArrowRight } from 'react-icons/lu';
import { RESOURCES } from '../data/content';
import { ResourceArt } from './Illustrations';

export default function ResourceSection({ navigate }) {
  return (
    <section className="resources" aria-labelledby="res-h">
      <h2 id="res-h" className="panel__title">Learning Resources</h2>
      <div className="resources__row">
        {RESOURCES.map((r) => (
          <button key={r.key} className="res" onClick={() => navigate(r.to)}>
            <ResourceArt kind={r.key} tone={r.tone} />
            <span className="res__text">
              <strong>{r.title}</strong>
              <small>{r.desc}</small>
              <span className="res__go" aria-hidden="true">
                <LuArrowRight size={17} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
