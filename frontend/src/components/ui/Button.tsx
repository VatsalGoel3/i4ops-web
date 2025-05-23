import clsx from "clsx";
// Import a spinner component if you have one, e.g., import Spinner from './Spinner';
// For this example, I'll use a simple text indicator.

export default function Button({
  children,
  variant = "primary",
  className,
  isLoading = false, // Added isLoading prop
  size = "md", // Added size prop
  icon: Icon, // Added icon prop (assuming it's a Lucide icon component)
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean; // Type definition for isLoading
  size?: "sm" | "md" | "lg"; // Type definition for size
  icon?: React.ElementType; // Type definition for icon
}) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-xl2 font-medium focus:outline-none focus-visible:ring",
        // Adjusted padding and text size based on size prop
        size === "sm" && "px-3 py-1 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-5 py-3 text-base",
        variant === "primary" && "bg-brand text-white hover:bg-brand-soft",
        variant === "secondary" && "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        "disabled:opacity-50 disabled:cursor-not-allowed", // Added cursor style for disabled
        isLoading && "relative flex items-center justify-center", // Style for loading state
        className
      )}
      disabled={props.disabled || isLoading} // Disable button when loading
      aria-label={Icon && !children ? (typeof children === 'string' ? children : 'Button') : undefined} // Added aria-label if only icon is present
    >
      {isLoading ? (
        // Replace with your actual Spinner component
        // <Spinner className={clsx(size === 'sm' ? 'h-4 w-4' : 'h-5 w-5', children && 'mr-2')} />
        'Loading...' // Simple text indicator for loading
      ) : (
        <>
          {Icon && <Icon className={clsx("h-5 w-5", children && "mr-2", size === 'sm' && 'h-4 w-4')} />} {/* Render icon */}
          {children}
        </>
      )}
    </button>
  );
}