import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-48 bg-gray-900 text-gray-100 flex flex-col">
        {["Users", "Projects"].map((txt) => (
          <NavLink
            key={txt}
            to={txt.toLowerCase()}
            className={({ isActive }) =>
              clsx(
                "px-4 py-3 hover:bg-gray-700",
                isActive && "bg-gray-700 font-semibold"
              )
            }
          >
            {txt}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}