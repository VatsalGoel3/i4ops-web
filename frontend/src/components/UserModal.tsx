import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { api } from "../axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { toast } from "../toast";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Button from "./ui/Button";
import { AxiosError } from "axios";
import type { User } from "../types";

export default function UserModal({
  isOpen,
  close,
  refresh,
  userToEdit,
  mode = "create",
}: {
  isOpen: boolean;
  close: () => void;
  refresh: () => void;
  userToEdit?: User | null;
  mode?: "create" | "edit";
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("UserModal opened. Mode:", mode, "User:", userToEdit);
  }, [isOpen, mode, userToEdit]);

  const Schema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: mode === "edit" ? Yup.string() : Yup.string().min(8, "Min 8 characters").required("Required"),
    role: Yup.string().oneOf(["viewer", "editor", "admin"]).required("Role is required"),
    active: Yup.boolean(),
  });

  const save = async (values: any) => {
    setIsLoading(true);
    try {
      if (mode === "edit" && userToEdit) {
        await api.put(`/users/${userToEdit.username}`, values);
        toast.success("User updated");
      } else {
        await api.post("/users/", values);
        toast.success("User created");
      }
      refresh();
      close();
    } catch (error: any) {
      console.error(`Failed to ${mode} user:`, error);
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error(`Permission denied to ${mode} user.`);
      } else {
        toast.error(error.response?.data?.detail || `Failed to ${mode} user`);
      }
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
            <Dialog.Title className="text-lg font-medium mb-4">
              {mode === "edit" && userToEdit ? `Edit “${userToEdit.username}”` : "Add New User"}
            </Dialog.Title>

            <Formik
              initialValues={{
                username: userToEdit?.username || "",
                email: userToEdit?.email || "",
                password: "",
                role: userToEdit?.role || "viewer",
                active: userToEdit?.active ?? true,
              }}
              validationSchema={Schema}
              onSubmit={save}
              enableReinitialize
            >
              {({ }) => (
                <Form className="space-y-4">
                  {["username", "email", "password"].map((f) => (
                    <div key={f}>
                      <label htmlFor={f} className="block text-sm font-medium mb-1 capitalize">
                        {f}
                      </label>
                      {f === "password" ? (
                        <div className="relative">
                          <Field
                            id={f}
                            name={f}
                            placeholder={
                              mode === "edit" ? "Leave blank to keep current password" : "Password"
                            }
                            type={showPassword ? "text" : "password"}
                            className="w-full border p-2 rounded bg-white dark:bg-gray-800 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      ) : (
                        <Field
                          id={f}
                          name={f}
                          placeholder={f}
                          type="text"
                          disabled={mode === "edit" && f === "username"}
                          className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                        />
                      )}
                      <ErrorMessage name={f} component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="viewer">viewer</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {mode === "edit" && (
                    <label className="flex items-center gap-2 text-sm">
                      <Field type="checkbox" name="active" />
                      <span>Active</span>
                    </label>
                  )}

                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={close} className="border px-3 py-1 rounded">
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