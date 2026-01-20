import { Image, Tooltip } from "@mantine/core";

interface CountryFlagProps {
  country?: string;
  countryCode?: string;
  size?: number;
}

export const CountryFlag = ({
  country,
  countryCode,
  size = 24,
}: CountryFlagProps) => {
  const src =
    countryCode === "-" || !countryCode || !country
      ? "/placeholder/24x18?text=NA"
      : `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

  return (
    <Tooltip label={country?.toLowerCase()}>
      <Image
        src={src}
        alt={country?.toLowerCase()}
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
