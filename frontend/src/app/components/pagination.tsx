// components/pagination-controls.tsx
"use client";

import { Pagination, PaginationProps } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
  total: number;
} & PaginationProps;

export default function PaginationControls({
  total,
  ...props
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const handleChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (total <= 1) return null;

  return (
    <Pagination
      value={page}
      onChange={handleChange}
      total={total}
      mt="xl"
      {...props}
    />
  );
}
