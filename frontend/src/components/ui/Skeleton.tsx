export default function Skeleton({ className = "" }: { className?: string }) {
    return (
      <div className={`animate-pulse rounded-xl2 bg-gray-300 dark:bg-gray-700 ${className}`} />
    );
  }