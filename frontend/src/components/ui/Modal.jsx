import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto mt-15 mb-2 dark:bg-black/90">
      <div className="flex min-h-screen items-center justify-center w-full mx-auto pl-4">
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"
        />
        <div
          className={`relative w-full ${sizeClasses[size]} transform rounded-xl bg-white dark:bg-white/5 border border-black/20 dark:border-white/20 shadow-2xl transition-all`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-500/30 px-6 py-4">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">{title}</div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-0 md:px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
