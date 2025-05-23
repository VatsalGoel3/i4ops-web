import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../axios";
import AddProjectModal from "../components/AddProjectModal";
import { useRole } from "../hooks/useRole";
import { useAuth } from "@clerk/clerk-react";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { Table } from "../components/ui/Table";
import Button from "../components/ui/Button";

interface Project {
  id: string;
  pretty_name?: string;
  shortname?: string;
}

export default function Projects() {
  const [data, setData] = useState<Project[] | null>(null);
  const [open, setOpen] = useState(false);
  const role = useRole();
  const { isSignedIn } = useAuth();

  const load = () => api.get("/projects/").then((r) => setData(r.data));
  useEffect(() => {
    if (!isSignedIn) return;
    load();
  }, [isSignedIn]);

  if (!data) return <Skeleton className="h-48 w-full" />;
  if (data.length === 0) return <EmptyState msg="No projects yet" />;

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold"
      >
        Projects
      </motion.h1>

      <div className="flex justify-end">
        {role !== "viewer" && (
          <Button onClick={() => setOpen(true)}>+ Add</Button>
        )}
      </div>

      <Table>
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr className="text-left text-xs uppercase tracking-wider">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Pretty Name</th>
            <th className="px-4 py-2">Shortname</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="odd:bg-white/5 even:bg-white/0 hover:bg-brand/5">
              <td className="px-4 py-2">{p.id}</td>
              <td className="px-4 py-2">{p.pretty_name}</td>
              <td className="px-4 py-2">{p.shortname}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddProjectModal isOpen={open} close={() => setOpen(false)} refresh={load} />
    </div>
  );
}