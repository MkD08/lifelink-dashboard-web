type ToastProps = {
    message: string;
    type?: "success" | "error" | "info";
  };
  
  export default function Toast({ message, type = "info" }: ToastProps) {
    const styles =
      type === "success"
        ? "bg-green-50 border-green-200 text-green-700"
        : type === "error"
        ? "bg-red-50 border-red-200 text-red-700"
        : "bg-blue-50 border-blue-200 text-blue-700";
  
    return (
      <div
        className={`min-w-[280px] rounded-2xl border px-4 py-3 shadow-lg ${styles}`}
      >
        <p className="text-sm font-semibold">{message}</p>
      </div>
    );
  }