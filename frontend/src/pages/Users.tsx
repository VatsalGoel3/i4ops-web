import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../axios";
import AddUserModal from "../components/AddUserModal";
import { useRole } from "../hooks/useRole";
import { useAuth } from "@clerk/clerk-react";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { Table } from "../components/ui/Table";
import Button from "../components/ui/Button";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Users() {
  const [data, setData] = useState<User[] | null>(null);
  const [open, setOpen] = useState(false);
  const role = useRole();
  const { isSignedIn } = useAuth();

  const load = () => api.get("/users/").then((r) => setData(r.data));
  useEffect(() => {
    if (!isSignedIn) return;
    load();
  }, [isSignedIn]);

  if (!data) return <Skeleton className="h-48 w-full" />;
  if (data.length === 0) return <EmptyState msg="No users yet" />;

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold"
      >
        Users
      </motion.h1>

      <div className="flex justify-end">
        {role !== "viewer" && (
          <Button onClick={() => setOpen(true)}>+ Add</Button>
        )}
      </div>

      <Table>
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr className="text-left text-xs uppercase tracking-wider">
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr key={u.username} className="odd:bg-white/5 even:bg-white/0 hover:bg-brand/5">
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddUserModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}