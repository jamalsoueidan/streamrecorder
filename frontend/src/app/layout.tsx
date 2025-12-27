import {
  ColorSchemeScript,
  MantineColorsTuple,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const myColor: MantineColorsTuple = [
  "#e1f8ff",
  "#cbedff",
  "#9ad7ff",
  "#64c1ff",
  "#3aaefe",
  "#20a2fe",
  "#099cff",
  "#0088e4",
  "#0079cd",
  "#0068b6",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

export const metadata: Metadata = {
  title: "StreamRecorder",
  description: "Rewatch your favorit streamer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications color="red" position="bottom-center" />
          <NuqsAdapter>{children}</NuqsAdapter>
        </MantineProvider>
      </body>
    </html>
  );
}
