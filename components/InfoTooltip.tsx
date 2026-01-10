"use client";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2 group">
      <button
        type="button"
        onClick={(e) => {
            e.preventDefault(); // Prevent form submit triggers if inside form
            setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-neutral-500 hover:text-green-400 transition-colors focus:outline-none"
        aria-label="More info"
      >
        <HelpCircle size={14} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl text-xs text-neutral-300 z-50 animate-in fade-in zoom-in-95 duration-200 leading-relaxed pointer-events-none">
          {text}
          {/* Cosmetic arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-700" />
        </div>
      )}
    </div>
  );
}
