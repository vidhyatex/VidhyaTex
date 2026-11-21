"use client";

import {
  DEFAULT_FLOATING_ACTIONS,
  type FloatingActionsFlags,
} from "@/lib/admin/floating-actions";
import { createContext, useContext, type ReactNode } from "react";

const FloatingActionsContext = createContext<FloatingActionsFlags>(
  DEFAULT_FLOATING_ACTIONS,
);

export function FloatingActionsProvider({
  floatingActions,
  children,
}: {
  floatingActions: FloatingActionsFlags;
  children: ReactNode;
}) {
  return (
    <FloatingActionsContext.Provider value={floatingActions}>
      {children}
    </FloatingActionsContext.Provider>
  );
}

export function useFloatingActions() {
  return useContext(FloatingActionsContext);
}
