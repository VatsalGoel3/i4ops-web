import { useEffect, useState } from "react";
import { api } from "../axios";
import AddProjectModal from "../components/AddProjectModal";
import DataTable from "../components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface Project {
  id: string;
  pretty_name?: string;
  shortname?: string;
}

export default function Projects() {
  const [data, setData] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const load = () => api.get("/projects/").then((r) => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const cols: ColumnDef<Project>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Pretty Name", accessorKey: "pretty_name" },
    { header: "Shortname", accessorKey: "shortname" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Add
        </button>
      </div>
      <div className="border rounded-xl2 overflow-hidden shadow">
        <DataTable data={data} columns={cols} />
      </div>
      <AddProjectModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}