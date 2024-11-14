import React from "react";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text0-sm text-destructive">
      <HiOutlineExclamationTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
