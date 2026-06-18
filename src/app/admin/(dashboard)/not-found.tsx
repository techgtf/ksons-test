'use client';
import React from "react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";


export default function AdminNotFound() {
      const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-light text-gray-800 mb-4">404</h1>

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 transition-all hover:bg-gray-200 hover:text-black"
      >
        <BiArrowBack className="text-2xl" />
        <span className="font-medium"> Go Back</span>
      </button>
    </div>
  );
}
