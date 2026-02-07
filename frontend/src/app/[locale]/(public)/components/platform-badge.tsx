import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { Badge, Grid, GridCol } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type PlatformBadgesProps = {
  href: string;
  activePlatform?: string;
  countrySuffix?: string;
};

export async function PlatformBadges({
  href,
  activePlatform,
  countrySuffix = "",
}: PlatformBadgesProps) {
  const t = await getTranslations("protected.filters.platforms");

  return (
    <Grid align="center" justify="center">
      {streamingPlatforms.map((p) => {
        const isActive = p.name.toLowerCase() === activePlatform?.toLowerCase();

        return (
          <GridCol key={p.name} span={{ base: 4, sm: "content" }}>
            <Link href={`${href}${p.name.toLowerCase()}${countrySuffix}`}>
              <Badge
                variant="platform"
                leftSection={
                  <span
                    style={{
                      maskImage: `url(${p.file})`,
                      WebkitMaskImage: `url(${p.file})`,
                    }}
                  />
                }
                color={p.color}
                style={{
                  outline: isActive ? `2px solid ${p.colorCss}` : undefined,
                  outlineOffset: isActive ? "2px" : undefined,
                  filter: isActive
                    ? `drop-shadow(0 0 10px ${p.colorCss})`
                    : undefined,
                  transition: "all 0.2s ease",
                }}
              >
                {t(p.name.toLowerCase())}
              </Badge>
            </Link>
          </GridCol>
        );
      })}
    </Grid>
  );
}
