import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../axios";
import AddUserModal from "../components/AddUserModal";
import DataTable from "../components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { useRole } from "../hooks/useRole";
import { useAuth } from "@clerk/clerk-react"; // 🆕

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Users() {
  const [data, setData] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const role = useRole(); // 🆕
  const { isLoaded } = useAuth(); // 🆕

  const load = () => api.get("/users/").then((r) => setData(r.data));
  useEffect(() => {
    if (!isLoaded) return;
    load();
  }, [isLoaded]);

  const cols: ColumnDef<User>[] = [
    { header: "Username", accessorKey: "username" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold mb-6"
      >
        Users
      </motion.h1>

      <div className="flex justify-end">
        {role !== "viewer" && (
          <button className="btn-primary" onClick={() => setOpen(true)}>+ Add</button>
        )}
      </div>

      <section className="bg-white dark:bg-gray-900 rounded-xl2 shadow-sm border">
        <DataTable data={data} columns={cols} />
      </section>

      <AddUserModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}