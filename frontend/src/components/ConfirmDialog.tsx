import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={onCancel} className="fixed inset-0 z-40 flex items-center justify-center p-4">
        {/* Backdrop */}
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

        {/* Panel */}
        <Transition.Child as={Fragment}>
          <Dialog.Panel className="relative z-50 bg-white dark:bg-gray-900 rounded-xl2 p-6 w-full max-w-sm shadow-lg">
            <Dialog.Title className="text-lg font-medium mb-2">{title}</Dialog.Title>
            <p className="text-sm mb-6">{message}</p>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onCancel} className="border px-3 py-1 rounded">
                {cancelLabel}
              </button>
              <button type="button" onClick={onConfirm} className="btn-primary">
                {confirmLabel}
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}