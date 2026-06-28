import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import Toast from "../../../components/common/Toast";
  import { registerToastHandler } from "../../../services/toast.service";
  
  type ToastType = "success" | "error" | "info";
  
  type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
  };
  
  type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
  };
  
  const ToastContext = createContext<ToastContextType | undefined>(undefined);
  
  export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
  
    const showToast = useCallback(
      (message: string, type: ToastType = "info") => {
        const id = Date.now() + Math.random();
  
        setToasts((prev) => [...prev, { id, message, type }]);
  
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
      },
      []
    );
  
    const value = useMemo(() => ({ showToast }), [showToast]);
    useEffect(() => {
      registerToastHandler(showToast);
    }, [showToast]);
  
    return (
      <ToastContext.Provider value={value}>
        {children}
  
        <div className="fixed right-4 top-4 z-[100] flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
            />
          ))}
        </div>
      </ToastContext.Provider>
    );
  }
  
  export function useToast() {
    const context = useContext(ToastContext);
  
    if (!context) {
      throw new Error("useToast must be used inside ToastProvider");
    }
  
    return context;
  }