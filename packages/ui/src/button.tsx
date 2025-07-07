"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export function Button({
  onClick,
  children,
  variant = "primary",
  className = "", 
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-black hover:bg-gray-400";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded font-medium transition duration-200 ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
