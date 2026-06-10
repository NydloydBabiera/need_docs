"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  className = "",
  children,
  loading = false,
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {icon && iconPosition === "left" && <span>{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span>{icon}</span>}
        </>
      )}
    </button>
  );
}