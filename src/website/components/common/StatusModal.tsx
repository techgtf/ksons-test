import React, { useEffect } from "react";
import { BiCloset } from "react-icons/bi";


type StatusModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: "success" | "error";
    autoClose?: boolean;
    autoCloseTime?: number;
};

export default function StatusModal({
    isOpen,
    onClose,
    title,
    message,
    type = "success",
    autoClose = true,
    autoCloseTime = 3000,
}: StatusModalProps) {
    useEffect(() => {
        if (!isOpen || !autoClose) return;

        const timer = setTimeout(() => {
            onClose();
        }, autoCloseTime);

        return () => clearTimeout(timer);
    }, [isOpen, autoClose, autoCloseTime, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div
                className={`relative w-full max-w-md rounded-3xl border p-6 shadow-2xl animate-[SuccessfadeIn_.3s_ease]
        ${type === "success"
                        ? "border-green-500/20 bg-white"
                        : "border-red-500/20 bg-white"
                    }`}
            >
               
                {/* Icon */}
                <div className="flex justify-center">
                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl
            ${type === "success"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                    >
                        {type === "success" ? "✓" : "!"}
                    </div>
                </div>

                {/* Content */}
                <div className="mt-5 text-center">
                    <h3 className="text-2xl font-semibold text-black">
                        {title || (type === "success" ? "Success" : "Error")}
                    </h3>

                    <p className="mt-3 text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className={`rounded-full px-6 py-3 text-sm font-medium text-white transition
            ${type === "success"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}