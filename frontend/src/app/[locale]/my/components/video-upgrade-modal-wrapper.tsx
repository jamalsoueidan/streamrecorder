"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VideoUpgradeModal } from "./video-upgrade-modal";

export function VideoUpgradeModalWrapper() {
  const router = useRouter();
  const [opened, setOpened] = useState(true);

  const handleClose = () => {
    setOpened(false);
    router.back();
  };

  return <VideoUpgradeModal opened={opened} onClose={handleClose} />;
}
