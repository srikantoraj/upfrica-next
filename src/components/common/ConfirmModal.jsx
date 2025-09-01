//src/components/common/ConfirmModal.jsx
"use client";

import { Dialog } from "@headlessui/react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
        <Dialog.Title className="text-lg font-bold text-black dark:text-white">
          {title}
        </Dialog.Title>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {message}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose} // ✅ updated from onCancel
            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md"
          >
            Yes, Undo
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
