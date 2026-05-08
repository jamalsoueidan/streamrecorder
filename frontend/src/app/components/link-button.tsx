"use client";

// Thin client-side wrapper so server components can render a Mantine
// Button that navigates via the locale-aware Link. Passing
// `component={Link}` directly from a server component fails because
// component-references aren't serialisable across the RSC boundary.

import { Button, ButtonProps } from "@mantine/core";
import { ComponentProps } from "react";
import Link from "@/app/components/link";

type Props = ButtonProps & ComponentProps<typeof Link>;

export function LinkButton(props: Props) {
  return <Button component={Link} {...props} />;
}
