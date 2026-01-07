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
  if (countryCode === "-" || !countryCode || !country) {
    return null;
  }

  return (
    <Tooltip label={country.toLowerCase()}>
      <Image
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        alt={country.toLowerCase()}
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
