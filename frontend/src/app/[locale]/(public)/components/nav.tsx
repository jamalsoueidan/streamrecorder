import { IconUsers, IconVideo } from "@tabler/icons-react";

export const navConfig = {
  tools: [
    {
      key: "creators",
      label: "Creators",
      href: "/creators/all",
      icon: IconUsers,
    },
    {
      key: "recordings",
      label: "Recordings",
      href: "/recordings/all",
      icon: IconVideo,
    },
  ],
  navLinks: [
    { key: "blogs", label: "Blogs", href: "/blogs" },
    { key: "pricing", label: "Pricing", href: "/pricing" },
  ],
  languages: [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ],
  featuredCreators: [
    { key: "browse", label: "Browse All", href: "/creators/all" },
    { key: "tiktok", label: "TikTok", href: "/creators/tiktok" },
    { key: "twitch", label: "Twitch", href: "/creators/twitch" },
    { key: "kick", label: "Kick", href: "/creators/kick" },
    { key: "youtube", label: "YouTube", href: "/creators/youtube" },
    { key: "afreecatv", label: "AfreecaTV", href: "/creators/afreecatv" },
    { key: "pandalive", label: "PandaLive", href: "/creators/pandalive" },
    { key: "bigo", label: "Bigo", href: "/creators/bigo" },
  ],
  watchRecordings: [
    { key: "browse", label: "Browse All", href: "/recordings/all" },
    { key: "tiktok", label: "TikTok", href: "/recordings/tiktok" },
    { key: "twitch", label: "Twitch", href: "/recordings/twitch" },
    { key: "kick", label: "Kick", href: "/recordings/kick" },
    { key: "youtube", label: "YouTube", href: "/recordings/youtube" },
    { key: "afreecatv", label: "AfreecaTV", href: "/recordings/afreecatv" },
    { key: "pandalive", label: "PandaLive", href: "/recordings/pandalive" },
    { key: "bigo", label: "Bigo", href: "/recordings/bigo" },
  ],
  legal: [
    { key: "privacy", label: "Privacy Policy", href: "/privacy" },
    { key: "terms", label: "Terms of Service", href: "/terms" },
    { key: "dmca", label: "DMCA", href: "/dmca" },
  ],
  company: [
    { key: "news", label: "News", href: "/news" },
    { key: "faq", label: "FAQ", href: "/faq" },
    { key: "updates", label: "Updates", href: "/changelog" },
    { key: "sitemap", label: "Sitemap", href: "/sitemap.xml" },
    { key: "contact", label: "Contact", href: "/contact" },
  ],
};
