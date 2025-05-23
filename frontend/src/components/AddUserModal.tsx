import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { api } from "../axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { toast } from "../toast";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Button from "./ui/Button";
import { AxiosError } from "axios";

export default function AddUserModal({
  isOpen,
  close,
  refresh,
}: {
  isOpen: boolean;
  close: () => void;
  refresh: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Schema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    role: Yup.string().oneOf(["viewer", "editor", "admin"], "Invalid role").required("Role is required"),
  });

  const save = async (values: any) => {
    setIsLoading(true);
    try {
      await api.post("/users/", values);
      toast.success("User created");
      refresh();
      close();
    } catch (error: any) {
      console.error("Failed to create user:", error);
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error("You do not have permission to create users.");
      } else {
        toast.error(error.response?.data?.detail || "Failed to create user");
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
                      <label htmlFor={f} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                        {f}
                      </label>
                      {f === "password" ? (
                        <div className="relative">
                          <Field
                            id={f}
                            name={f}
                            placeholder={f}
                            type={showPassword ? "text" : "password"}
                            className="w-full border p-2 rounded bg-white dark:bg-gray-800 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                            aria-label={showPassword ? "Hide password" : "Show password"}
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
                          className="w-full border p-2 rounded bg-white dark:bg-gray-800"
                        />
                      )}

                      <ErrorMessage name={f} component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="role" className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
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

                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={close} className="border px-3 py-1 rounded dark:border-gray-700 dark:text-gray-300">
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