import { Sun, Moon, Menu } from "lucide-react";
import { Switch } from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/clerk-react";

export default function Header({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-surface-dark shadow">
      <button onClick={onSidebarToggle} className="lg:hidden mr-2">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold tracking-wide">i4ops Console</h1>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Sun className="h-4 w-4" />
          <Switch
            checked={dark}
            onCheckedChange={setDark}
            className="w-10 h-5 bg-gray-300 rounded-full data-[state=checked]:bg-brand-soft transition-colors relative"
          >
            <span
              className="block w-4 h-4 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform
                         data-[state=checked]:translate-x-5"
            />
          </Switch>
          <Moon className="h-4 w-4" />
        </label>

        <UserButton />
      </div>
    </header>
  );
}