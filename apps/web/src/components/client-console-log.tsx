"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ClientConsoleLog() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("zmiana dodana przez copilot'a");
  }, [pathname]);

  return null;
}
