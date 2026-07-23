import {
  createSearchParamsCache,
  inferParserType,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export enum SortOptions {
  createdAtDesc = "createdAt:desc",
  createdAtAsc = "createdAt:asc",
  viewsCountDesc = "viewsCount:desc",
  downloadsCountDesc = "downloadsCount:desc",
}

export const clipsParsers = {
  sort: parseAsStringEnum<SortOptions>(Object.values(SortOptions)).withDefault(
    SortOptions.createdAtDesc,
  ),
  // Platform filter — matches the clip's follower.type. "" = all platforms.
  type: parseAsString.withDefault(""),
};

export const clipsParamsCache = createSearchParamsCache(clipsParsers);

export type ClipsFilters = inferParserType<typeof clipsParsers>;
