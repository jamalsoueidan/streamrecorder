import { getToken } from "@/lib/token";
import { Badge, Button, Container, Flex, Title } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";

const links = [
  { link: "/", label: "Home" },
  { link: "/tiktok", label: "Tiktok recordings" },
  { link: "/twitch", label: "Twitch recordings" },
  { link: "/pricing", label: "Pricing" },
];

export async function Header() {
  const token = await getToken();
  const isLoggedIn = !!token;

  return (
    <header
      style={{
        height: 64,
        marginBottom: 32,
      }}
    >
      <Container size="lg" h="100%">
        <Flex justify="space-between" align="center" h="100%">
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <Badge
              size="lg"
              c="white"
              bg="red"
              radius="xs"
              style={{
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#ffffff",
                    animation: "blink 1s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    letterSpacing: "0.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    textShadow: "0 0 1px rgba(255,255,255,0.5)",
                  }}
                >
                  Live
                </span>
              </span>
            </Badge>

            <Title
              order={4}
              style={{
                color: "#f1f5f9",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Stream Recorder
            </Title>
          </Link>

          {/* Navigation */}
          <Flex gap={4} align="center" visibleFrom="sm" display="none">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.link}
                style={{
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  borderRadius: 8,
                  padding: "8px 16px",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </Flex>

          {/* Auth Buttons */}
          <Flex gap={12} align="center">
            {isLoggedIn ? (
              <Button
                component="a"
                href="/following"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                radius="md"
                style={{ fontWeight: 600 }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  component="a"
                  href="/login"
                  variant="subtle"
                  radius="md"
                  style={{
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
                <Button
                  component="a"
                  href="/register"
                  variant="gradient"
                  gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                  radius="md"
                  leftSection={<IconUserPlus size={18} />}
                  style={{ fontWeight: 600 }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </header>
  );
}
