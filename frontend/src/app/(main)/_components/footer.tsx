"use client";
import { Container, Text } from "@mantine/core";

import Link from "next/link";
import classes from "./footer.module.css";

const data = [
  {
    title: "Recordings",
    links: [
      { label: "Tiktok recordings", link: "#" },
      { label: "Twitch recordings", link: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { link: "/privacy", label: "Privacy Policy" },
      { link: "/terms", label: "Terms & Conditions" },
      { link: "/dmca", label: "DMCA policy" },
    ],
  },
  {
    title: "About",
    links: [
      { link: "/product-updates", label: "News" },
      { link: "/faq", label: "Faq" },
      { link: "/product-updates", label: "Updates" },
      { link: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component={Link}
        href={link.link}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          StreamRecorder
          <Text size="sm" c="dimmed" className={classes.description}>
            Never miss a live stream again
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2026 streamrecorder.com. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
