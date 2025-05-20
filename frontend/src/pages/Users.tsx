import { useEffect, useState } from "react";
import { api } from "../axios";
import DataTable from "../components/DataTable";
import AddUserModal from "../components/AddUserModal";
import type { ColumnDef } from "@tanstack/react-table";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Users() {
  const [data, setData] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const load = () => api.get("/users/").then((r) => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const cols: ColumnDef<User>[] = [
    { header: "Username", accessorKey: "username" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Add
        </button>
      </div>
      <div className="border rounded-xl2 overflow-hidden shadow">
        <DataTable data={data} columns={cols} />
      </div>
      <AddUserModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}