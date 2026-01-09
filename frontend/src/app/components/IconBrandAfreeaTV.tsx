import { forwardRef, SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "stroke"> {
  size?: number | string;
  stroke?: number | string;
}

export const IconBrandAfreecatv = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, stroke = 2, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Speech bubble outline */}
      <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v4a4 4 0 0 1 -4 4h-2l-4 4v-4h-2a4 4 0 0 1 -4 -4v-4z" />
      {/* Play/broadcast triangle inside */}
      <path d="M10 8l5 2.5l-5 2.5z" />
    </svg>
  )
);

IconBrandAfreecatv.displayName = "IconBrandAfreecatv";

export default IconBrandAfreecatv;
