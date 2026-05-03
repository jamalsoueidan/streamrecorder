import { Image, Tooltip } from "@mantine/core";
import { useLocale } from "next-intl";

interface CountryFlagProps {
  countryCode?: string;
  size?: number;
}

export const CountryFlag = ({ countryCode, size = 24 }: CountryFlagProps) => {
  const locale = useLocale();
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });

  if (!countryCode || countryCode === "-") {
    return null;
  }

  const country = regionNames.of(countryCode.toUpperCase());
  const src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

  return (
    <Tooltip label={country}>
      <Image
        src={src}
        alt={country}
        style={{
          width: size,
          height: size * 0.75,
          objectFit: "cover",
          borderRadius: 2,
        }}
      />
    </Tooltip>
  );
};
