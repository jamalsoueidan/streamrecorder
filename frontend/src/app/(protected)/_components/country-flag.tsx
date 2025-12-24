import { Image, Tooltip } from "@mantine/core";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

interface CountryFlagProps {
  country: string;
  size?: number;
}

export const CountryFlag = ({ country, size = 24 }: CountryFlagProps) => {
  const code = countries.getAlpha2Code(country, "en")?.toLowerCase();

  if (!code) return null;

  return (
    <Tooltip label={country}>
      <Image
        src={`https://flagcdn.com/w40/${code}.png`}
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
