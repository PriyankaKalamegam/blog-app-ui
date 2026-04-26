import clsx from "clsx";

export default function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "rounded-xl border px-4 py-3 text-sm font-medium shadow-card backdrop-blur transition",
            toast.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            toast.type === "error" && "border-rose-200 bg-rose-50 text-rose-800",
            toast.type === "info" && "border-brand-200 bg-brand-50 text-brand-800"
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
