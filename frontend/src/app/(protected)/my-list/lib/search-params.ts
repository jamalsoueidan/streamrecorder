import { getDateRange } from "@/app/lib/get-date-range";
import {
  createSearchParamsCache,
  inferParserType,
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export enum SortOptions {
  createdAtDesc = "createdAt:desc",
  createdAtAsc = "createdAt:asc",
  UsernameDesc = "username:desc",
  UsernameAsc = "username:asc",
  TotalRecordingsDesc = "totalRecordings:desc",
  TotalRecordingsAsc = "totalRecordings:asc",
}

export const exploreParsers = {
  sort: parseAsStringEnum<SortOptions>(Object.values(SortOptions)).withDefault(
    SortOptions.createdAtDesc
  ),
  hasRecordings: parseAsBoolean.withDefault(true),
  gender: parseAsString,
  country: parseAsString,
  language: parseAsString,
  type: parseAsString,
  search: parseAsString,
  dateRange: parseAsString,
};

export const creatorsParamsCache = createSearchParamsCache(exploreParsers);

export type CreatorFilters = inferParserType<typeof exploreParsers>;

export const buildCreatorsFilters = (filters: CreatorFilters) => ({
  ...(filters.gender && { gender: { $eq: filters.gender } }),
  ...(filters.country && { countryCode: { $eq: filters.country } }),
  ...(filters.language && { languageCode: { $eq: filters.language } }),
  ...(filters.type && { type: { $eq: filters.type } }),
  ...(filters.search && { username: { $containsi: filters.search } }),
  ...getDateRange(filters.dateRange),
});
