"use client";

import { useEffect } from "react";

interface Props {
  followerDocumentId: string;
}

export function ProfileViewTracker({ followerDocumentId }: Props) {
  useEffect(() => {
    fetch(`/api/profile-view/${followerDocumentId}`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [followerDocumentId]);

  return null;
}
