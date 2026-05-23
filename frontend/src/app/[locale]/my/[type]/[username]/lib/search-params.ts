import {
  createSearchParamsCache,
  inferParserType,
  parseAsStringEnum,
} from "nuqs/server";

export enum SortOptions {
  createdAtDesc = "createdAt:desc",
  createdAtAsc = "createdAt:asc",
  viewsCountDesc = "viewsCount:desc",
  downloadsCountDesc = "downloadsCount:desc",
}

export const profileParsers = {
  sort: parseAsStringEnum<SortOptions>(Object.values(SortOptions)).withDefault(
    SortOptions.createdAtDesc
  ),
};

export const profileParamsCache = createSearchParamsCache(profileParsers);

export type ProfileFilters = inferParserType<typeof profileParsers>;
