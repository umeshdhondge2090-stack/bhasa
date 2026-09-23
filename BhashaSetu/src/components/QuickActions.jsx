import { LuCamera, LuFileText, LuUsers, LuDownload } from 'react-icons/lu';

const ITEMS = [
  { label: 'Scan Worksheet', Icon: LuCamera, to: '/assess', tone: 'blue' },
  { label: 'Create Worksheet', Icon: LuFileText, to: '/resources', tone: 'green' },
  { label: 'Manage Class', Icon: LuUsers, to: '/progress', tone: 'blue' },
  { label: 'Download Content', Icon: LuDownload, to: '/resources', tone: 'green' },
];

export default function QuickActions({ navigate }) {
  return (
    <section className="panel" aria-labelledby="qa-h">
      <h2 id="qa-h" className="panel__title">Quick Actions</h2>
      <div className="qa">
        {ITEMS.map((it) => (
          <button key={it.label} className="qa__item" onClick={() => navigate(it.to)}>
            <span className={`qa__icon tone-${it.tone}`}>
              <it.Icon size={22} />
            </span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
