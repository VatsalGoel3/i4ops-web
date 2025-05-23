export default function Skeleton({ className = "", shape = "square" }: { className?: string, shape?: "square" | "circle" }) {
    return (
      <div
        className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${shape === 'circle' ? 'rounded-full' : 'rounded-xl2'} ${className}`}
        role="status"
        aria-live="polite"
        aria-label="Loading..."
      />
    );
  }