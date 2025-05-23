import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { api } from "../axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { toast } from "../toast";
import * as Yup from "yup";
import Button from "../components/ui/Button";

export default function AddProjectModal({
  isOpen,
  close,
  refresh,
}: {
  isOpen: boolean;
  close: () => void;
  refresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const Schema = Yup.object().shape({
    id: Yup.string().required("ID is required"),
    pretty_name: Yup.string().required("Pretty Name is required"),
    shortname: Yup.string().required("Shortname is required"),
  });

  const save = async (values: any) => {
    setIsLoading(true);
    try {
      await api.post("/projects/", values);
      toast.success("Project created");
      refresh();
      close();
    } catch (error: any) {
      console.error("Failed to create project:", error);
      toast.error(error.response?.data?.detail || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
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
          className="bg-white dark:bg-gray-900 rounded-xl2 p-6 w-full max-w-md shadow-lg relative z-50"
        >
            <Dialog.Title className="text-lg font-medium mb-2">Add Project</Dialog.Title>
            <Formik initialValues={{ id: "", pretty_name: "", shortname: "" }} validationSchema={Schema} onSubmit={save}>
              {({ }) => (
                <Form className="space-y-4">
                  {["id", "pretty_name", "shortname"].map((f) => (
                    <div key={f}>
                      <label htmlFor={f} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                        {f.replace('_', ' ')}
                      </label>
                      <Field
                        id={f}
                        name={f}
                        placeholder={`Enter ${f.replace('_', ' ')}`}
                        className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                      />
                      <ErrorMessage name={f} component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  ))}

                  <div className="flex justify-end gap-2">
                    <button type="button" className="border px-3 py-1 rounded dark:border-gray-700 dark:text-gray-300" onClick={close}>
                      Cancel
                    </button>
                    <Button type="submit" isLoading={isLoading}>
                      Save
                    </Button>
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