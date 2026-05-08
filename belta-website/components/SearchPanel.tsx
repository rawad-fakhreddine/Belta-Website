"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ar";
}

export default function SearchPanel({ isOpen, onClose, lang = "en" }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(id);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  return (
    /* Wrapper collapses height when closed */
    <div
      style={{
        height: isOpen ? "68px" : "0",
        overflow: "hidden",
        transition: "height 280ms var(--ease-out)",
        borderTop: isOpen ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      {/* Inner fades in slightly after height starts opening */}
      <div
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 200ms var(--ease-out) 60ms",
          padding: "13px 32px",
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Search icon */}
        <Search
          size={16}
          strokeWidth={1.5}
          style={{ color: focused ? "var(--brand)" : "var(--fg-subtle)", flexShrink: 0, transition: "color 280ms var(--ease-out)" }}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          placeholder={lang === "en" ? "Search for a scarf…" : "ابحث عن وشاح…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          style={{
            flex: 1,
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 400,
            color: "var(--fg)",
            background: "transparent",
            border: "none",
            outline: "none",
            lineHeight: 1.5,
          }}
        />

        {/* X close */}
        <button
          onClick={onClose}
          aria-label="Close search"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            color: "var(--fg-subtle)",
            borderRadius: "var(--radius-sm)",
            flexShrink: 0,
          }}
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
