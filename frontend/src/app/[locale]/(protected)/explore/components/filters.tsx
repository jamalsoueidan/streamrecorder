"use client";

import {
  Badge,
  Button,
  Chip,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  Indicator,
  Select,
  SelectProps,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import {
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconFilter,
  IconGenderFemale,
  IconGenderMale,
  IconQuestionMark,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { PLATFORM_OPTIONS, typeIcons } from "../../components/filters-types";
import { followingParsers, FollowingSortOptions } from "../lib/search-params";

const sortIcons: Record<string, React.ReactNode> = {
  [FollowingSortOptions.updatedAtDesc]: <IconArrowDown size={24} />,
  [FollowingSortOptions.updatedAtAsc]: <IconArrowUp size={24} />,
};

const sortLabels: Record<string, string> = {
  [FollowingSortOptions.updatedAtDesc]: "Newest",
  [FollowingSortOptions.updatedAtAsc]: "Oldest",
};

const genderIcons: Record<string, React.ReactNode> = {
  all: <IconUsers size={24} />,
  male: <IconGenderMale size={24} />,
  female: <IconGenderFemale size={24} />,
  unknown: <IconQuestionMark size={24} />,
};

const genderLabels: Record<string, string> = {
  all: "All",
  female: "Female",
  male: "Male",
  unknown: "Other",
};

const GENDER_VALUES = ["all", "female", "male", "unknown"];

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisWeek", label: "This week" },
  { value: "lastWeek", label: "Last week" },
  { value: "thisMonth", label: "This month" },
  { value: "lastMonth", label: "Last month" },
];

// Intl converters
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

const getCountryName = (code: string) => {
  try {
    return regionNames.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
};

const getLanguageName = (code: string) => {
  try {
    return languageNames.of(code.toLowerCase()) || code;
  } catch {
    return code;
  }
};

const FlagIcon = ({ code, size = 20 }: { code: string; size?: number }) => (
  <Image
    src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
    alt={code}
    w={size}
    h={Math.round(size * 0.75)}
    radius={2}
    fit="cover"
  />
);

interface FilterOption {
  value: string;
  label: string;
}

interface FilterOptions {
  genders: FilterOption[];
  types: FilterOption[];
  countryCodes: FilterOption[];
  languageCodes: FilterOption[];
}

interface Props {
  filterOptions?: FilterOptions;
}

export default function Filters({ filterOptions }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [filters, setFilters] = useQueryStates(followingParsers);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value || null });
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const activeFilterCount = [
    filters.gender,
    filters.country,
    filters.language,
    filters.type,
    filters.dateRange,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      gender: null,
      country: null,
      language: null,
      type: null,
      dateRange: null,
      sort: FollowingSortOptions.updatedAtDesc,
    });
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilters({ search: null });
  };

  // Custom render for country options
  const renderCountryOption: SelectProps["renderOption"] = ({ option }) => (
    <Group gap="sm">
      <FlagIcon code={option.value} size={24} />
      <span>
        {getCountryName(option.value)} ({option.label.match(/\d+/)?.[0]})
      </span>
    </Group>
  );

  // Custom render for language options
  const renderLanguageOption: SelectProps["renderOption"] = ({ option }) => (
    <Group gap="sm">
      <Badge size="sm" variant="light" tt="uppercase" w={40}>
        {option.value}
      </Badge>
      <span>
        {getLanguageName(option.value)} ({option.label.match(/\d+/)?.[0]})
      </span>
    </Group>
  );

  const countrySelectData =
    filterOptions?.countryCodes?.map((c) => ({
      value: c.value,
      label: `${getCountryName(c.value)} (${c.label.match(/\d+/)?.[0] || 0})`,
    })) || [];

  const languageSelectData =
    filterOptions?.languageCodes?.map((l) => ({
      value: l.value,
      label: `${getLanguageName(l.value)} (${l.label.match(/\d+/)?.[0] || 0})`,
    })) || [];

  // Top 6 countries and languages for chips
  const topCountries = countrySelectData.slice(0, 6);
  const topLanguages = languageSelectData.slice(0, 6);

  return (
    <>
      <Flex
        direction={{ base: "column", sm: "row" }}
        w={{ base: "100%", sm: "auto" }}
        gap="xs"
      >
        {/* Search Input */}
        <TextInput
          placeholder="Search username..."
          size="md"
          leftSection={<IconSearch size={18} />}
          rightSection={
            searchValue ? (
              <IconX
                size={16}
                style={{ cursor: "pointer" }}
                onClick={clearSearch}
              />
            ) : null
          }
          value={searchValue}
          onChange={(e) => handleSearchChange(e.currentTarget.value)}
          style={{ flex: 1 }}
          w={{ base: "100%", sm: "auto" }}
        />

        {filters.type ||
        filters.gender ||
        filters.country ||
        filters.language ||
        filters.dateRange ? (
          <Group>
            {/* Active filter badges */}
            {filters.type && (
              <Badge
                variant="light"
                size="lg"
                leftSection={typeIcons[filters.type]}
                rightSection={
                  <IconX
                    size={16}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilters({ type: null })}
                  />
                }
              >
                {filters.type}
              </Badge>
            )}
            {filters.gender && (
              <Badge
                variant="light"
                size="lg"
                leftSection={genderIcons[filters.gender]}
                rightSection={
                  <IconX
                    size={16}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilters({ gender: null })}
                  />
                }
              >
                {filters.gender === "unknown" ? "Other" : filters.gender}
              </Badge>
            )}
            {filters.country && (
              <Badge
                variant="light"
                size="lg"
                leftSection={<FlagIcon code={filters.country} size={18} />}
                rightSection={
                  <IconX
                    size={16}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilters({ country: null })}
                  />
                }
              >
                {getCountryName(filters.country)}
              </Badge>
            )}
            {filters.language && (
              <Badge
                variant="light"
                size="lg"
                leftSection={
                  <Badge size="xs" variant="filled" tt="uppercase">
                    {filters.language}
                  </Badge>
                }
                rightSection={
                  <IconX
                    size={16}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilters({ language: null })}
                  />
                }
              >
                {getLanguageName(filters.language)}
              </Badge>
            )}
            {filters.dateRange && (
              <Badge
                variant="light"
                size="lg"
                leftSection={<IconCalendar size={16} />}
                rightSection={
                  <IconX
                    size={16}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilters({ dateRange: null })}
                  />
                }
              >
                {DATE_RANGE_OPTIONS.find((d) => d.value === filters.dateRange)
                  ?.label || filters.dateRange}
              </Badge>
            )}

            {activeFilterCount > 0 && (
              <Button size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </Group>
        ) : null}

        <Indicator
          disabled={activeFilterCount === 0}
          label={activeFilterCount}
          size={18}
        >
          <Button
            variant="light"
            size="md"
            leftSection={<IconFilter size={20} />}
            onClick={open}
            fullWidth
          >
            Filters
          </Button>
        </Indicator>
      </Flex>

      <Drawer opened={opened} onClose={close} title="Filters" position="right">
        <Stack gap="lg">
          {/* Sort - Grid */}
          <Stack gap={4}>
            <Text size="md" fw={500}>
              Sort by
            </Text>
            <SimpleGrid cols={4} spacing="xs">
              {Object.values(FollowingSortOptions).map((sortValue) => (
                <UnstyledButton
                  key={sortValue}
                  onClick={() => setFilters({ sort: sortValue })}
                  style={(theme) => ({
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${
                      filters.sort === sortValue
                        ? theme.colors.blue[1]
                        : theme.colors.gray[3]
                    }`,
                    backgroundColor:
                      filters.sort === sortValue
                        ? theme.colors.blue[9]
                        : "transparent",
                    textAlign: "center",
                  })}
                >
                  <Stack gap={2} align="center">
                    {sortIcons[sortValue]}
                    <Text size="xs">{sortLabels[sortValue]}</Text>
                  </Stack>
                </UnstyledButton>
              ))}
            </SimpleGrid>
          </Stack>

          <Divider />

          {/* Platform - SegmentedControl */}
          <Stack gap={4}>
            <Text size="md" fw={500}>
              Platform
            </Text>
            <SimpleGrid cols={3} spacing="xs">
              {PLATFORM_OPTIONS.map((p) => (
                <UnstyledButton
                  key={p.value}
                  onClick={() =>
                    setFilters({ type: p.value === "all" ? null : p.value })
                  }
                  style={(theme) => ({
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${
                      filters.type === p.value ||
                      (p.value === "all" && !filters.type)
                        ? theme.colors.blue[1]
                        : theme.colors.gray[3]
                    }`,
                    backgroundColor:
                      filters.type === p.value ||
                      (p.value === "all" && !filters.type)
                        ? theme.colors.blue[9]
                        : "transparent",
                    textAlign: "center",
                  })}
                >
                  {p.label}
                </UnstyledButton>
              ))}
            </SimpleGrid>
          </Stack>

          {/* Gender - Grid */}
          <Stack gap={4}>
            <Text size="md" fw={500}>
              Gender
            </Text>
            <SimpleGrid cols={4} spacing="xs">
              {GENDER_VALUES.map((genderValue) => (
                <UnstyledButton
                  key={genderValue}
                  onClick={() =>
                    setFilters({
                      gender: genderValue === "all" ? null : genderValue,
                    })
                  }
                  style={(theme) => ({
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${
                      (filters.gender || "all") === genderValue
                        ? theme.colors.blue[1]
                        : theme.colors.gray[3]
                    }`,
                    backgroundColor:
                      (filters.gender || "all") === genderValue
                        ? theme.colors.blue[9]
                        : "transparent",
                    textAlign: "center",
                  })}
                >
                  <Stack gap={2} align="center">
                    {genderIcons[genderValue]}
                    <Text size="xs">{genderLabels[genderValue]}</Text>
                  </Stack>
                </UnstyledButton>
              ))}
            </SimpleGrid>
          </Stack>

          <Divider />

          {/* Date Range - Chips */}
          <Stack gap={4}>
            <Text size="md" fw={500}>
              Added
            </Text>
            <Chip.Group
              value={filters.dateRange || ""}
              onChange={(value) =>
                setFilters({
                  dateRange: typeof value === "string" ? value || null : null,
                })
              }
            >
              <Group gap="xs">
                {DATE_RANGE_OPTIONS.map((d) => (
                  <Chip key={d.value} value={d.value} variant="light">
                    {d.label}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Stack>

          <Divider />

          {/* Country - Chips + Select */}
          <Stack gap={4}>
            <Text size="md" fw={500}>
              Country
            </Text>
            <Chip.Group
              value={filters.country || ""}
              onChange={(value) =>
                setFilters({
                  country: typeof value === "string" ? value || null : null,
                })
              }
            >
              <Group gap="xs">
                {topCountries.map((c) => (
                  <Chip key={c.value} value={c.value} variant="light">
                    <Group gap={6}>
                      <FlagIcon code={c.value} size={16} />
                      {getCountryName(c.value)}
                    </Group>
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
            {countrySelectData.length > 6 && (
              <Select
                mt={3}
                size="md"
                placeholder="More countries..."
                value={filters.country}
                onChange={(value) => setFilters({ country: value })}
                data={countrySelectData}
                renderOption={renderCountryOption}
                clearable
                searchable
              />
            )}
          </Stack>

          {/* Language - Chips + Select */}
          <Stack gap={4}>
            <Text size="md" fw={500}>
              Language
            </Text>
            <Chip.Group
              value={filters.language || ""}
              onChange={(value) =>
                setFilters({
                  language: typeof value === "string" ? value || null : null,
                })
              }
            >
              <Group gap="xs">
                {topLanguages.map((l) => (
                  <Chip key={l.value} value={l.value} variant="light">
                    <Group gap={6}>
                      <Badge size="xs" variant="filled" tt="uppercase">
                        {l.value}
                      </Badge>
                      {getLanguageName(l.value)}
                    </Group>
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
            {languageSelectData.length > 6 && (
              <Select
                mt={3}
                size="md"
                placeholder="More languages..."
                value={filters.language}
                onChange={(value) => setFilters({ language: value })}
                data={languageSelectData}
                renderOption={renderLanguageOption}
                clearable
                searchable
              />
            )}
          </Stack>

          <Divider />

          <Group grow>
            <Button variant="subtle" size="md" onClick={clearFilters}>
              Clear all
            </Button>
            <Button size="md" onClick={close}>
              Done
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
