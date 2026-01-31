"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { MainNav } from "./MainNav";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MainNav />
      {children}
    </SessionProvider>
  );
}
