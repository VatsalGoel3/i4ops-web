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
import { toast } from "../toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2 } from "lucide-react";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Users() {
  const [data, setData] = useState<User[] | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const role = useRole();
  const { isSignedIn } = useAuth();

  const load = () => {
    setIsLoading(true);
    api.get("/users/")
      .then((r) => setData(r.data))
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users.");
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isSignedIn) return;
    load();
  }, [isSignedIn]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex justify-end"><Skeleton className="h-10 w-24" /></div>
        <Table>
          <thead>
            <tr>
              <th className="px-4 py-2"><Skeleton className="h-4 w-20" /></th>
              <th className="px-4 py-2"><Skeleton className="h-4 w-32" /></th>
              <th className="px-4 py-2"><Skeleton className="h-4 w-24" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-2"><Skeleton className="h-4 w-24" /></td>
                <td className="px-4 py-2"><Skeleton className="h-4 w-32" /></td>
                <td className="px-4 py-2"><Skeleton className="h-4 w-24" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  if (data && data.length === 0) {
    return (
      <EmptyState
        msg="No users yet"
        action={role !== "viewer" ? <Button onClick={() => setOpen(true)}>+ Add User</Button> : undefined}
      />
    );
  }

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
            {role === "admin" && <th className="px-4 py-2 text-right w-12" />}
          </tr>
        </thead>
        <tbody>
          {data?.map((u) => (
            <tr key={u.username} className="odd:bg-white/5 even:bg-white/0 hover:bg-brand/5">
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 capitalize">{u.role}</td>
              {role === "admin" && (
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => setToDelete(u.username)}
                    className="p-1.5 text-red-500 hover:text-red-600 focus-visible:ring rounded"
                    aria-label={`Delete ${u.username}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <AddUserModal isOpen={open} close={() => setOpen(false)} refresh={load} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete user?"
        message={`Are you sure you want to remove “${toDelete}”? This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          try {
            await api.delete(`/users/${toDelete}`);
            toast.success("User deleted");
            load();
          } catch (e) {
            toast.error("Failed to delete user");
          } finally {
            setToDelete(null);
          }
        }}
      />
    </div>
  );
}