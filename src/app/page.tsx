"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login immediately (no auth check needed in dev)
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-bg-dark">
      <p className="text-text-secondary">Redirecting to login...</p>
    </div>
  );
}
