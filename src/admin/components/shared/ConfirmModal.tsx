"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineTrash } from "react-icons/hi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  confirmColor?: string;
  icon?: React.ReactNode;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  confirmColor = "bg-red-600 hover:bg-red-700",
  icon = <HiOutlineTrash className="text-xl text-red-500" />,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              {icon}
            </div>

            <h3 className="text-lg font-bold text-gray-800">{title}</h3>

            <p className="mt-1.5 text-sm text-gray-500">{message}</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-xl ${confirmColor} py-2.5 text-sm font-semibold text-white shadow-sm transition-colors`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
