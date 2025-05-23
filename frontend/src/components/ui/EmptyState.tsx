import { Inbox } from "lucide-react";
import React from "react";

export default function EmptyState({
  msg,
  icon: Icon = Inbox,
  title,
  action,
}: {
  msg: string;
  icon?: React.ElementType;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="h-12 w-12 mb-3" />
      {title && <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">{title}</h3>}
      <p>{msg}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}