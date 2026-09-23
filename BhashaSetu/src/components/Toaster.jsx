import { LuCircleCheck, LuInfo, LuTriangleAlert, LuX } from 'react-icons/lu';
import { useApp } from '../context/AppContext';

const ICON = { success: LuCircleCheck, info: LuInfo, error: LuTriangleAlert };

export default function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toaster" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => {
        const I = ICON[t.type] || LuInfo;
        return (
          <div key={t.id} className={`toast toast--${t.type} ${t.leaving ? 'is-leaving' : ''}`} role="status">
            <I size={20} />
            <span>{t.message}</span>
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss">
              <LuX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
