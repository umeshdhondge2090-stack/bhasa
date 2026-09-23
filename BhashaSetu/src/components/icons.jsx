import {
  LuHouse, LuMic, LuBookOpen, LuClipboardCheck, LuChartColumn, LuFolderOpen, LuSettings,
} from 'react-icons/lu';

const MAP = {
  home: LuHouse,
  mic: LuMic,
  book: LuBookOpen,
  assess: LuClipboardCheck,
  progress: LuChartColumn,
  folder: LuFolderOpen,
  settings: LuSettings,
};

export function NavIcon({ name, size = 22 }) {
  const I = MAP[name] || LuHouse;
  return <I size={size} strokeWidth={2.1} aria-hidden="true" />;
}

export function CloudCheck({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M13 36a9 9 0 0 1-1.6-17.9A11 11 0 0 1 33 15.5 8.6 8.6 0 0 1 35 36Z" fill="#16A36A" opacity=".18" />
      <path d="M13 36a9 9 0 0 1-1.6-17.9A11 11 0 0 1 33 15.5 8.6 8.6 0 0 1 35 36Z" fill="none" stroke="#16A36A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 26.5l4.5 4.5L31 22" fill="none" stroke="#16A36A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
