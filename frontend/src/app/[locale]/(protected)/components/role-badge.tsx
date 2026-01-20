import { Badge, MantineColor, MantineGradient, Tooltip } from "@mantine/core";
import {
  IconAward,
  IconCrown,
  IconShield,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";
import { ReactNode } from "react";

type RoleBadgeProps = {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
};

type RoleStyle = {
  color?: MantineColor;
  gradient?: MantineGradient;
  variant?: "filled" | "gradient" | "light" | "outline" | "dot";
  icon?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const roleStyles: Record<string, RoleStyle> = {
  champion: {
    variant: "gradient",
    gradient: { from: "gold", to: "yellow", deg: 90 },
    icon: <IconAward size={16} />,
    size: "md",
  },
  admin: {
    variant: "filled",
    color: "red",
    icon: <IconShield size={16} />,
    size: "md",
  },
  moderator: {
    variant: "filled",
    color: "red",
    icon: <IconShield size={16} />,
    size: "md",
  },
  premium: {
    variant: "gradient",
    gradient: { from: "violet", to: "grape", deg: 90 },
    icon: <IconCrown size={16} />,
    size: "md",
  },
  basic: {
    variant: "light",
    color: "blue",
    icon: <IconUser size={14} />,
    size: "md",
  },
  public: {
    variant: "outline",
    color: "gray",
    icon: <IconWorld size={14} />,
    size: "md",
  },
};

const defaultStyle: RoleStyle = {
  variant: "light",
  color: "gray",
  size: "md",
};

export const RoleBadge = ({ role }: { role: RoleBadgeProps }) => {
  const roleName = role.name?.toLowerCase() ?? "";
  const style = roleStyles[roleName] ?? defaultStyle;

  return (
    <Tooltip label={role.description} disabled={!role.description}>
      <Badge
        size={style.size}
        variant={style.variant}
        fw="400"
        color={style.color}
        gradient={style.gradient}
      >
        {role.name}
      </Badge>
    </Tooltip>
  );
};
