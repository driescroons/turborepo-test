import React from "react";

export function Button({ color, label, type, onClick }) {
  return (
    <button
      className="px-4 rounded text-white text-sm font-semibold"
      type={type}
      style={{
        backgroundColor: color,
      }}
    >
      {label}
    </button>
  );
}
