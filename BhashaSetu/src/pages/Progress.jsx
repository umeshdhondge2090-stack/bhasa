import { PageHeader } from '../components/Header';
import ProgressIndicator from '../components/ProgressIndicator';
import { useApp } from '../context/AppContext';
import { classAverage, gradeFor, studentScores } from '../lib/stats';

const ago = (t) => {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
};

export default function Progress() {
  const { records, klass } = useApp();
  const students = studentScores(records).sort((a, b) => b.score - a.score);
  const avg = classAverage(records);
  const support = students.filter((s) => s.score < 70);
  return (
    <div className="page progress">
      <PageHeader title="Progress" subtitle={`${klass} • how every child is doing`} />
      <div className="progress__grid">
        <section className="surface progress__hero">
          <ProgressIndicator variant="ring" value={avg} label="Class average" size={170} />
          <div>
            <h2>{avg >= 75 ? 'The class is doing well' : 'Steady progress'}</h2>
            <p>
              {support.length
                ? `${support.length} ${support.length === 1 ? 'student' : 'students'} may benefit from extra practice: ${support.map((s) => s.name.split(' ')[0]).join(', ')}.`
                : 'Everyone is on track.'}
            </p>
          </div>
        </section>

        <section className="surface progress__list" aria-label="Students">
          <h2 className="panel__title">Students</h2>
          <ul>
            {students.map((s) => (
              <li key={s.name}>
                <span className="dot-avatar">{s.name[0]}</span>
                <span className="progress__name">{s.name}</span>
                <ProgressIndicator variant="bar" value={s.score} />
                <b>{s.score}%</b>
                <span className={`grade-chip g-${gradeFor(s.score)[0]}`}>{gradeFor(s.score)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface progress__recent" aria-label="Recent activity">
          <h2 className="panel__title">Recent activity</h2>
          {records.length === 0 ? (
            <p className="muted">Finished lessons and scanned sheets appear here.</p>
          ) : (
            <ul>
              {records.slice(0, 6).map((r, i) => (
                <li key={i}>
                  <span>{r.type === 'assessment' ? `${r.student} • Grade ${r.grade}` : `${r.title} lesson`}</span>
                  <b>{r.score}%</b>
                  <small>{ago(r.at)}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
