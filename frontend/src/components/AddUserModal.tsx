import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { api } from "../axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { toast } from "../toast";
import * as Yup from "yup";

export default function AddUserModal({
  isOpen,
  close,
  refresh,
}: {
  isOpen: boolean;
  close: () => void;
  refresh: () => void;
}) {

  const Schema = Yup.object().shape({
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required(),
    role: Yup.string().oneOf(["viewer", "editor", "admin"]).required(),
  });

  const save = async (values: any) => {
    await api.post("/users/", values);
    toast.success("User created");
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
            <Dialog.Title className="text-lg font-medium mb-4">Add New User</Dialog.Title>

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                role: "viewer",
              }}
              validationSchema={Schema}
              onSubmit={save}
            >
              {({ }) => (
                <Form className="space-y-4">
                  {["username", "email", "password"].map((f) => (
                    <div key={f}>
                      <Field
                        name={f}
                        placeholder={f}
                        type={f === "password" ? "password" : "text"}
                        className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                      />
                      <ErrorMessage name={f} component="div" className="text-red-500 text-sm" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm mb-1">Role</label>
                    <Field
                      as="select"
                      name="role"
                      className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="viewer">viewer</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </Field>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={close} className="border px-3 py-1 rounded">
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