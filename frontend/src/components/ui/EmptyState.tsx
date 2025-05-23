import { Inbox } from "lucide-react";

export default function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Inbox className="h-12 w-12 mb-3" />
      <p>{msg}</p>
    </div>
  );
}