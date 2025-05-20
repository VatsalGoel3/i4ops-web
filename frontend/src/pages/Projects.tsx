import { useEffect, useState } from "react";
import { api } from "../axios";
import AddProjectModal from "../components/AddProjectModal.tsx";

interface Project { id:string; pretty_name?:string; shortname?:string; }

export default function Projects() {
  const [list, setList] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const load = () => api.get("/projects/").then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold flex justify-between mb-4">
        Projects
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={()=>setOpen(true)}>+ Add</button>
      </h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100"><tr>
          <th className="p-2">ID</th><th className="p-2">Pretty Name</th><th className="p-2">Shortname</th>
        </tr></thead>
        <tbody>
          {list.map(p=>(
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.pretty_name}</td>
              <td className="p-2">{p.shortname}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddProjectModal isOpen={open} close={()=>setOpen(false)} refresh={load}/>
    </div>
  );
}