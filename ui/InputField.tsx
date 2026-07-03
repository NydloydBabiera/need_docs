"use client";

import React from "react";

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: string;
}

export default function InputField({
  className = "",
  label,
  error,
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input className={className} {...props} />

      {error && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
}