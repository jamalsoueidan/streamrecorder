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
  return (
    <Tooltip
      label={country !== "-" && country ? country.toLowerCase() : "unknown"}
    >
      <Image
        src={`https://flagcdn.com/w40/${
          countryCode !== "-" && countryCode ? countryCode.toLowerCase() : "un"
        }.png`}
        alt={country !== "-" && country ? country.toLowerCase() : "unknown"}
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
