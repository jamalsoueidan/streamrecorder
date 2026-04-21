"use client";

import NextError from "next/error";

export default function GlobalError(_props: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
