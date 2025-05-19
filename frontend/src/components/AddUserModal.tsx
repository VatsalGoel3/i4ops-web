import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { api } from "../axios";
import DiffViewer from "./DiffViewer";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  const [diff, setDiff] = useState("");

  const Schema = Yup.object().shape({
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required(),
    role: Yup.string().oneOf(["viewer", "editor", "admin"]).required(),
  });

  const preview = async (values: any) => {
    const { data } = await api.post("/diff/users/", values);
    setDiff(data.diff);
  };

  const save = async (values: any) => {
    await api.post("/users/", values);
    refresh();
    close();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={close} className="relative z-50">
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
              <Dialog.Title className="text-lg font-medium">
                Add New User
              </Dialog.Title>

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
                {({ values }) => (
                  <Form className="space-y-4">
                    {["username", "email", "password"].map((f) => (
                      <div key={f}>
                        <Field
                          name={f}
                          placeholder={f}
                          type={f === "password" ? "password" : "text"}
                          className="w-full border p-2 rounded"
                        />
                        <ErrorMessage
                          name={f}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm mb-1">Role</label>
                      <Field
                        as="select"
                        name="role"
                        className="w-full border p-2 rounded"
                      >
                        <option value="viewer">viewer</option>
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                      </Field>
                    </div>

                    <button
                      type="button"
                      className="bg-gray-200 px-3 py-1 rounded"
                      onClick={() => preview(values)}
                    >
                      Preview Diff
                    </button>

                    <DiffViewer diff={diff} />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={close}
                        className="px-3 py-1 rounded border"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}