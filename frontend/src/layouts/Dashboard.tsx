import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Users, FolderKanban } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const links = [
  { to: "/users", label: "Users", icon: Users },
  { to: "/projects", label: "Projects", icon: FolderKanban },
];

export default function Dashboard() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-surface dark:bg-surface-dark text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 224 : 64 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }} // smoother
        className="bg-gray-900 text-gray-100 z-20 overflow-hidden"
      >
        <nav className="grid gap-1 pt-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "group relative flex items-center gap-3 rounded-lg mx-2 px-3 py-2 transition-colors",
                  isActive ? "bg-gray-800 text-brand" : "hover:bg-gray-800 hover:text-brand-soft"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={clsx("truncate", !open && "hidden xl:inline")}>{label}</span>

              {/* Tooltip when collapsed */}
              {!open && (
                <span
                  className="absolute left-full ml-2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 
                             opacity-0 group-hover:opacity-100 pointer-events-none transition"
                >
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSidebarToggle={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}