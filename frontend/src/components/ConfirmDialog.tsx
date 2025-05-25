import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* --- Backdrop with lower z-index --- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 z-40" />
        </Transition.Child>

        {/* --- Dialog Panel with higher z-index --- */}
        <Transition.Child as={Fragment}>
          <Dialog.Panel
            className="relative z-50 bg-white dark:bg-gray-900 rounded-xl2 p-6 w-full max-w-sm shadow-lg"
          >
            <Dialog.Title className="text-lg font-semibold mb-3">{title}</Dialog.Title>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onCancel} className="border px-3 py-1 rounded">
                Cancel
              </button>
              <button type="button" onClick={onConfirm} className="btn-primary">
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}