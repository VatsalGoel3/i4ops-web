import { useEffect, useState } from "react";
import { api } from "../api";

interface User { username:string; email:string; role:string; }

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { api.get("/users").then(r => setUsers(r.data)); }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100"><tr>
          <th className="p-2">Username</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
        </tr></thead>
        <tbody>
          {users.map(u => (<tr key={u.username} className="border-t">
            <td className="p-2">{u.username}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.role}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}