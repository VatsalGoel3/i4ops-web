import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../axios";
import UserModal from "../components/UserModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useRole } from "../hooks/useRole";
import { useAuth } from "@clerk/clerk-react";
//import Skeleton from "../components/ui/Skeleton";
//import EmptyState from "../components/ui/EmptyState";
import { Table } from "../components/ui/Table";
import Button from "../components/ui/Button";
import { toast } from "../toast";
import { Check, Slash, Pencil } from "lucide-react";
import type { User } from "../types";

export default function Users() {
  const [data, setData] = useState<User[] | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [toggleUser, setToggleUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const role = useRole();
  const { isSignedIn } = useAuth();

  const load = () => {
    setIsLoading(true);
    api.get<User[]>("/users/")
      .then((r) => setData(r.data))
      .catch(() => {
        toast.error("Failed to load users");
        setData([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isSignedIn) load();
  }, [isSignedIn]);

  const statusBadge = (u: User) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      u.active
        ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
    }`}>
      {u.active ? "Active" : "Disabled"}
    </span>
  );

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold mb-6"
      >
        Users
      </motion.h1>

      {role !== "viewer" && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setCreateOpen(true)}>+ Add</Button>
        </div>
      )}

      <Table>
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr className="text-left text-xs uppercase tracking-wider">
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            {role !== "viewer" && <th className="px-4 py-2" />}
          </tr>
        </thead>
        <tbody>
          {data?.map((u) => (
            <tr key={u.username} className="odd:bg-white/5 even:bg-white/0 hover:bg-brand/5">
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 capitalize">{u.role}</td>
              <td className="px-4 py-2">{statusBadge(u)}</td>
              {role !== "viewer" && (
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Pencil}
                    title="Edit"
                    onClick={() => setEditUser(u)}
                  />
                  <Button
                    size="sm"
                    variant={u.active ? "danger" : "primary"}
                    icon={u.active ? Slash : Check}
                    title={u.active ? "Disable" : "Enable"}
                    onClick={() => setToggleUser(u)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <UserModal
        mode="create"
        isOpen={createOpen}
        close={() => setCreateOpen(false)}
        refresh={load}
      />

      {editUser && (
        <UserModal
          mode="edit"
          initial={editUser}
          isOpen={!!editUser}
          close={() => setEditUser(null)}
          refresh={load}
        />
      )}

      {toggleUser && (
        <ConfirmDialog
          open={!!toggleUser}
          title={`${toggleUser.active ? "Disable" : "Enable"} “${toggleUser.username}”`}
          message={
            toggleUser.active
              ? "The user will no longer be able to SSH / Rsync into the VM."
              : "The user will regain VM access."
          }
          confirmLabel={toggleUser.active ? "Disable" : "Enable"}
          onCancel={() => setToggleUser(null)}
          onConfirm={async () => {
            try {
              await api.patch(`/users/${toggleUser.username}`, {
                active: !toggleUser.active,
              });
              toast.success(`${toggleUser.username} ${toggleUser.active ? "disabled" : "enabled"}`);
              setToggleUser(null);
              load();
            } catch {
              toast.error("Failed to update user");
            }
          }}
        />
      )}
    </>
  );
}
