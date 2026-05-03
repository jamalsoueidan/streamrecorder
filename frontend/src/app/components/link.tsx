import { Link as IntlLink } from "@/i18n/navigation";
import type { ComponentProps } from "react";

export default function Link(props: ComponentProps<typeof IntlLink>) {
  return <IntlLink prefetch={false} {...props} />;
}
