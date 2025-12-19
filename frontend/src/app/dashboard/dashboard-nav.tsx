"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav style={{ marginBottom: 16, display: "flex", gap: 16 }}>
      <Link
        href="/dashboard/followings"
        style={{
          fontWeight: pathname.includes("/followings") ? "bold" : "normal",
        }}
      >
        Followings
      </Link>
      <Link
        href="/dashboard/recordings"
        style={{
          fontWeight: pathname.includes("/recordings") ? "bold" : "normal",
        }}
      >
        Recordings
      </Link>
    </nav>
  );
}
