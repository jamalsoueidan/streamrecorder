import { BadgeVariant, MantineSize } from "@mantine/core";

declare module "@mantine/core" {
  export interface BadgeProps {
    variant?: BadgeVariant | "platform";
  }

  export interface ButtonProps {
    size?: MantineSize | "responsive";
  }
}
