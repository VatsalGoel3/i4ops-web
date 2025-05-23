import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-xl2 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring",
        variant === "primary" && "bg-brand text-white hover:bg-brand-soft",
        variant === "secondary" && "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        "disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}