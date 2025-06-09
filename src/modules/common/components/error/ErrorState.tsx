"use client";

import { ReactNode } from "react";

interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({ icon, title, message, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
      {icon && <div className="text-red-500">{icon}</div>}
      <h2 className="text-2xl font-semibold">{title ?? "Algo salió mal"}</h2>
      <p className="text-muted-foreground max-w-md">{message ?? "Ocurrió un error inesperado. Intenta más tarde."}</p>
      {action && <div className="pt-4">{action}</div>}
    </div>
  );
}
