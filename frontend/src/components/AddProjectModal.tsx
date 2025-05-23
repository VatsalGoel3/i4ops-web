import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { api } from "../axios";
import { Formik, Form, Field } from "formik";
import { motion } from "framer-motion";
import { toast } from "../toast";

export default function AddProjectModal({
  isOpen,
  close,
  refresh,
}: {
  isOpen: boolean;
  close: () => void;
  refresh: () => void;
}) {

  const save = async (v: any) => {
    await api.post("/projects/", v);
    toast.success("Project created");
    refresh();
    close();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={close} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <Transition.Child as={Fragment}>
        <Dialog.Panel
          as={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl2 p-6 w-full max-w-md shadow-lg"
        >
            <Dialog.Title className="text-lg font-medium mb-2">Add Project</Dialog.Title>
            <Formik initialValues={{ id: "", pretty_name: "", shortname: "" }} onSubmit={save}>
              {({ }) => (
                <Form className="space-y-4">
                  {["id", "pretty_name", "shortname"].map((f) => (
                    <Field
                      key={f}
                      name={f}
                      placeholder={f}
                      className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                    />
                  ))}

                  <div className="flex justify-end gap-2">
                    <button type="button" className="border px-3 py-1 rounded" onClick={close}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}