import React from "react";

export function Button({ color, children, type, loading }) {
  return (
    <button
      className="px-4 rounded text-white text-sm font-semibold"
      type={type}
      style={{
        backgroundColor: color,
      }}
      disabled={loading}
    >
      {children}
    </button>
  );
}
