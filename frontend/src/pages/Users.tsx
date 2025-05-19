import { useEffect, useState } from "react";
import { api } from "../axios";
import AddUserModal from "../components/AddUserModal";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    api.get("/users/").then((r) => setUsers(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex justify-between">
        Users
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          + Add User
        </button>
      </h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.username} className="border-t">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddUserModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}