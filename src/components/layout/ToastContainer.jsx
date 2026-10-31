import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-float border transition-all animate-fade-in ${
              isSuccess
                ? 'bg-forest-900 text-cream-50 border-butter-400/50'
                : isError
                ? 'bg-rose-900 text-cream-50 border-rose-500'
                : 'bg-charcoal-900 text-cream-50 border-cream-400/20'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-butter-400 flex-shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-butter-300 flex-shrink-0 mt-0.5" />}

            <div className="flex-grow text-xs leading-relaxed font-medium">
              {toast.message}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-cream-300 hover:text-white transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
