import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../axios";
import AddProjectModal from "../components/AddProjectModal";
import DataTable from "../components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";

interface Project {
  id: string;
  pretty_name?: string;
  shortname?: string;
}

export default function Projects() {
  const [data, setData] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);

  const load = () => api.get("/projects/").then((r) => setData(r.data));
  useEffect(() => { load(); }, []);

  const cols: ColumnDef<Project>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Pretty Name", accessorKey: "pretty_name" },
    { header: "Shortname", accessorKey: "shortname" },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold mb-6"
      >
        Projects
      </motion.h1>

      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setOpen(true)}>+ Add</button>
      </div>

      <section className="bg-white dark:bg-gray-900 rounded-xl2 shadow-sm border">
        <DataTable data={data} columns={cols} />
      </section>

      <AddProjectModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}