"use client";

import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }: { 
  message: string, 
  type?: "success" | "error", 
  onClose: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-emerald-600" : "bg-red-600";

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 z-[100]`}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      <p className="font-medium text-sm">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70 text-xs">✕</button>
    </div>
  );
}