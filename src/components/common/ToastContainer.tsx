import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border text-sm backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/20'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-white border-rose-800 shadow-rose-950/20'
              : 'bg-slate-800/95 text-slate-100 border-slate-700'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <Info className="w-5 h-5 text-sky-400" />
            )}
          </div>
          <p className="flex-1 text-xs leading-relaxed font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white shrink-0 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
