import { BadgeVariant } from "@mantine/core";

declare module "@mantine/core" {
  export interface BadgeProps {
    variant?: BadgeVariant | "platform";
  }
}
