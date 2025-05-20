import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { api } from "../axios";
import DiffViewer from "./DiffViewer";
import { Formik, Form, Field } from "formik";
import { toast } from "../toast";

export default function AddProjectModal({isOpen,close,refresh}:{isOpen:boolean;close:()=>void;refresh:()=>void;}) {
  const [diff,setDiff] = useState("");

  const preview = async (v:any) => {
    const { data } = await api.post("/projects/dry-run", v);
    setDiff(data.diff);
  };
  const save = async (v:any) => {
    await api.post("/projects/", v);
    toast.success("Project created");
    refresh(); close();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={close} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-medium mb-2">Add Project</Dialog.Title>
          <Formik initialValues={{id:"",pretty_name:"",shortname:""}} onSubmit={save}>
            {({values})=>(
              <Form className="space-y-4">
                {["id","pretty_name","shortname"].map(f=>(
                  <Field key={f} name={f} placeholder={f} className="w-full border p-2 rounded"/>
                ))}
                <button type="button" className="bg-gray-200 px-3 py-1 rounded" onClick={()=>preview(values)}>Preview Diff</button>
                <DiffViewer diff={diff}/>
                <div className="flex justify-end gap-2">
                  <button type="button" className="border px-3 py-1 rounded" onClick={close}>Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
}