"use client";

import { useEffect } from "react";

/** Bounce Supabase invite links to the password-setup screen. */
export function InviteRedirect() {
  useEffect(() => {
    if (typeof location === "undefined") return;
    if (location.hash.includes("access_token=") && location.hash.includes("type=invite")) {
      location.replace(`/setup-password${location.hash}`);
    }
  }, []);
  return null;
}
