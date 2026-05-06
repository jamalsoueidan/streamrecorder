// Localised strings for "streamer is live" pushes. We keep these in the
// backend (not in the frontend translation files) because the push fan-out
// runs server-side and the SW can't reach the frontend's i18n bundle.
//
// Eight locales — match the ones the frontend supports. Anything outside
// this set falls back to English in `getStrings()`.

export const PUSH_LOCALES = [
  "en",
  "ar",
  "tr",
  "ko",
  "ja",
  "es",
  "pt",
  "id",
] as const;

export type PushLocale = (typeof PUSH_LOCALES)[number];

interface Strings {
  single: (username: string, type: string) => { title: string; body: string };
  multi: (count: number) => { title: string; body: string };
}

export const PUSH_STRINGS: Record<PushLocale, Strings> = {
  en: {
    single: (n, t) => ({
      title: `${n} is live`,
      body: `Tap to watch on ${t}`,
    }),
    multi: (count) => ({
      title: `${count} of your streamers are live`,
      body: `Tap to see who's live`,
    }),
  },
  ar: {
    single: (n, t) => ({
      title: `${n} يبث الآن`,
      body: `اضغط للمشاهدة على ${t}`,
    }),
    multi: (count) => ({
      title: `${count} من المبثين الذين تتابعهم على الهواء`,
      body: `اضغط لرؤية من يبث الآن`,
    }),
  },
  tr: {
    single: (n, t) => ({
      title: `${n} canlı yayında`,
      body: `${t} üzerinde izlemek için dokun`,
    }),
    multi: (count) => ({
      title: `Takip ettiğin ${count} yayıncı canlı yayında`,
      body: `Kimin canlı olduğunu görmek için dokun`,
    }),
  },
  ko: {
    single: (n, t) => ({
      title: `${n} 라이브 중`,
      body: `${t}에서 보려면 탭하세요`,
    }),
    multi: (count) => ({
      title: `팔로우한 ${count}명의 스트리머가 라이브 중`,
      body: `누가 라이브인지 보려면 탭하세요`,
    }),
  },
  ja: {
    single: (n, t) => ({
      title: `${n}が配信中`,
      body: `${t}で視聴するにはタップ`,
    }),
    multi: (count) => ({
      title: `フォロー中の${count}名が配信中`,
      body: `誰が配信中か見るにはタップ`,
    }),
  },
  es: {
    single: (n, t) => ({
      title: `${n} está en vivo`,
      body: `Toca para ver en ${t}`,
    }),
    multi: (count) => ({
      title: `${count} de tus streamers están en vivo`,
      body: `Toca para ver quién está en vivo`,
    }),
  },
  pt: {
    single: (n, t) => ({
      title: `${n} está ao vivo`,
      body: `Toque para assistir no ${t}`,
    }),
    multi: (count) => ({
      title: `${count} dos seus streamers estão ao vivo`,
      body: `Toque para ver quem está ao vivo`,
    }),
  },
  id: {
    single: (n, t) => ({
      title: `${n} sedang live`,
      body: `Ketuk untuk menonton di ${t}`,
    }),
    multi: (count) => ({
      title: `${count} streamer yang kamu ikuti sedang live`,
      body: `Ketuk untuk melihat siapa yang live`,
    }),
  },
};

export function getStrings(locale: string | undefined): Strings {
  if (locale && (PUSH_LOCALES as readonly string[]).includes(locale)) {
    return PUSH_STRINGS[locale as PushLocale];
  }
  return PUSH_STRINGS.en;
}

// next-intl is configured with localePrefix: "as-needed", so en URLs have
// no prefix but every other locale does.
export function localizeUrl(locale: string | undefined, path: string): string {
  if (!locale || locale === "en") return path;
  if (!(PUSH_LOCALES as readonly string[]).includes(locale)) return path;
  return `/${locale}${path}`;
}
