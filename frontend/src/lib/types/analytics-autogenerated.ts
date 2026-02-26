/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface StreamerStats {
  /**
   * Total diamonds received from gifts
   * @example 125000
   */
  total_diamonds?: number;
  /**
   * Total gift diamonds received during battles, accumulated in real-time (sum of streamer_1_earnings across all battleEnd events)
   * @example 85000
   */
  battle_diamonds?: number;
  /**
   * Gift diamonds received outside of battles (total_diamonds - battle_diamonds)
   * @example 40000
   */
  non_battle_diamonds?: number;
  /**
   * Sum of team_1_score across all battles — TikTok battle score which includes power-up multipliers, not equivalent to raw diamond value
   * @example 220000
   */
  battle_score?: number;
  /**
   * Total number of gifts received
   * @example 3420
   */
  total_gifts?: number;
  /**
   * Number of unique users who sent gifts
   * @example 156
   */
  unique_gifters?: number;
  /**
   * Total chat messages received
   * @example 45230
   */
  total_messages?: number;
  /**
   * Number of unique users who chatted
   * @example 892
   */
  unique_chatters?: number;
  /**
   * Total viewer join events
   * @example 12450
   */
  total_joins?: number;
  /**
   * Total likes received
   * @example 89000
   */
  total_likes?: number;
  /**
   * Total battles participated in
   * @example 45
   */
  total_battles?: number;
  /**
   * Number of battles won
   * @example 28
   */
  battles_won?: number;
  /**
   * Number of battles lost
   * @example 12
   */
  battles_lost?: number;
  /**
   * Number of battles that ended in a draw
   * @example 5
   */
  battles_draw?: number;
}

export interface DailyEarnings {
  /**
   * Date of earnings
   * @format date
   * @example "2026-02-25"
   */
  date?: string;
  /**
   * Diamonds earned on this date
   * @example 4500
   */
  diamonds?: number;
  /**
   * Number of gifts received on this date
   * @example 120
   */
  gifts?: number;
  /**
   * Unique gifters on this date
   * @example 25
   */
  unique_gifters?: number;
}

export interface TopGifter {
  /**
   * TikTok username of the gifter
   * @example "generous_user123"
   */
  sender_username?: string;
  /**
   * Display name of the gifter
   * @example "Generous User"
   */
  sender_nickname?: string;
  /**
   * Total diamonds given by this user
   * @example 15000
   */
  diamonds?: number;
  /**
   * Number of gifts sent by this user
   * @example 45
   */
  gift_count?: number;
}

export interface Battle {
  /**
   * Unique battle ID assigned by TikTok
   * @example "1772049496701"
   */
  battle_id?: string;
  /**
   * TikTok timestamp of the battleStart event in milliseconds
   * @format int64
   * @example 1772049196701
   */
  started_at?: number;
  /**
   * TikTok timestamp of the battleEnd event in milliseconds (0 if battle is live or interrupted)
   * @format int64
   * @example 1772049496701
   */
  ended_at?: number;
  /**
   * Battle status: completed (battleEnd received), live (started <10min ago, no battleEnd), interrupted (no battleEnd, older)
   * @example "completed"
   */
  status?: BattleStatusEnum;
  /**
   * Type of battle
   * @example "1v1"
   */
  battle_type?: BattleBattleTypeEnum;
  /**
   * Owner ID of streamer in position 1 (the monitored streamer)
   * @example "6656737912518213638"
   */
  streamer_1?: string;
  /**
   * Username of streamer in position 1
   * @example "majd.alban"
   */
  streamer_1_username?: string;
  /**
   * Owner ID of streamer in position 2 (opponent or teammate in 2v2)
   * @example "6646443842008973318"
   */
  streamer_2?: string;
  /**
   * Username of streamer in position 2
   * @example "napiofficial27"
   */
  streamer_2_username?: string;
  /**
   * Owner ID of streamer in position 3 (1v1v1, 1v1v1v1, or 2v2 opponent)
   * @example ""
   */
  streamer_3?: string;
  /**
   * Username of streamer in position 3
   * @example ""
   */
  streamer_3_username?: string;
  /**
   * Owner ID of streamer in position 4 (1v1v1v1 or 2v2 opponent)
   * @example ""
   */
  streamer_4?: string;
  /**
   * Username of streamer in position 4
   * @example ""
   */
  streamer_4_username?: string;
  /**
   * Battle score of streamer 1. For 2v2: individual score, not team total. Includes power-up multipliers — not equivalent to diamonds. 0 for live or interrupted battles.
   * @example 1709
   */
  team_1_score?: number;
  /**
   * Battle score of streamer 2. 0 for live or interrupted battles.
   * @example 1838
   */
  team_2_score?: number;
  /**
   * Battle score of streamer 3 (0 if not present or battle not completed)
   * @example 0
   */
  team_3_score?: number;
  /**
   * Battle score of streamer 4 (0 if not present or battle not completed)
   * @example 0
   */
  team_4_score?: number;
  /**
   * Position of winner (1=streamer_1 won, 2/3/4=that position won, 0=draw or battle not completed)
   * @example 1
   */
  battle_won?: number;
  /**
   * Battle duration in seconds (typically 300 or 301)
   * @example 301
   */
  duration?: number;
  /**
   * Actual gift diamonds received by streamer_1 during this battle, accumulated in real-time from gift events while the battle was active. Does not include multiplier inflation — raw diamond value only.
   * @example 3000
   */
  gifts_during_battle?: number;
  /**
   * Highest power-up multiplier that fired during this battle (0=none, 2=2x Boosting Glove, 3=3x). Explains when battle score >> gifts_during_battle.
   * @example 3
   */
  max_multiplier?: number;
}

export interface Opponent {
  /**
   * Username of the opponent
   * @example "rival_streamer"
   */
  opponent_username?: string;
  /**
   * Total battles against this opponent
   * @example 8
   */
  battles?: number;
  /**
   * Wins against this opponent
   * @example 5
   */
  wins?: number;
  /**
   * Losses against this opponent
   * @example 3
   */
  losses?: number;
}

export interface StreamSession {
  /**
   * TikTok room ID for this stream session
   * @example "7340123456789012345"
   */
  room_id?: string;
  /**
   * When the stream started
   * @format date-time
   * @example "2026-02-25T10:00:00Z"
   */
  started_at?: string;
  /**
   * When the stream ended
   * @format date-time
   * @example "2026-02-25T14:30:00Z"
   */
  ended_at?: string;
  /**
   * Stream duration in minutes
   * @example 270
   */
  duration_minutes?: number;
  /**
   * Peak concurrent viewer count
   * @example 1250
   */
  peak_viewers?: number;
  /**
   * Average viewer count during stream
   * @example 450
   */
  avg_viewers?: number;
  /**
   * Diamonds earned during this stream
   * @example 8500
   */
  diamonds?: number;
  /**
   * Number of battles during this stream
   * @example 3
   */
  battles?: number;
}

export interface ScheduleDay {
  /**
   * Day of week (1=Monday, 7=Sunday)
   * @min 1
   * @max 7
   * @example 1
   */
  day_of_week?: number;
  /**
   * Total hours streamed on this day of week
   * @format float
   * @example 12.5
   */
  total_hours?: number;
  /**
   * Number of streams on this day of week
   * @example 4
   */
  stream_count?: number;
  /**
   * Most common hour when streams start (0-23)
   * @min 0
   * @max 23
   * @example 18
   */
  typical_start_hour?: number;
  /**
   * Most common hour when streams end (0-23)
   * @min 0
   * @max 23
   * @example 22
   */
  typical_end_hour?: number;
}

export interface PaginationMeta {
  /**
   * Total number of items across all pages
   * @example 92
   */
  total: number;
  /**
   * Number of items requested per page
   * @example 10
   */
  limit: number;
  /**
   * Number of items skipped
   * @example 0
   */
  offset: number;
  /**
   * Whether there are more items beyond the current page
   * @example true
   */
  hasMore: boolean;
}

export interface Error {
  /**
   * Error message
   * @example "Internal server error"
   */
  error?: string;
}

/**
 * Battle status: completed (battleEnd received), live (started <10min ago, no battleEnd), interrupted (no battleEnd, older)
 * @example "completed"
 */
export enum BattleStatusEnum {
  Completed = "completed",
  Live = "live",
  Interrupted = "interrupted",
}

/**
 * Type of battle
 * @example "1v1"
 */
export enum BattleBattleTypeEnum {
  Value1V1 = "1v1",
  Value2V2 = "2v2",
  Value1V1V1 = "1v1v1",
  Value1V1V1V1 = "1v1v1v1",
  Value2V1 = "2v1",
  Value1V2 = "1v2",
}

export interface GetStreamerStatsParams {
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerStatsData = StreamerStats;

export interface GetStreamerEarningsParams {
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerEarningsData = DailyEarnings[];

export interface GetStreamerTopGiftersParams {
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerTopGiftersData = TopGifter[];

export interface GetStreamerBattlesParams {
  /**
   * Number of items per page (max 50)
   * @min 1
   * @max 50
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Number of items to skip for pagination
   * @min 0
   * @default 0
   * @example 0
   */
  offset?: number;
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerBattlesData = PaginationMeta & {
  data?: Battle[];
};

export interface GetStreamerTopOpponentsParams {
  /**
   * Number of items per page (max 50)
   * @min 1
   * @max 50
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Number of items to skip for pagination
   * @min 0
   * @default 0
   * @example 0
   */
  offset?: number;
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerTopOpponentsData = PaginationMeta & {
  data?: Opponent[];
};

export interface GetStreamerActivityParams {
  /**
   * Number of sessions per page (max 100)
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * Number of items to skip for pagination
   * @min 0
   * @default 0
   * @example 0
   */
  offset?: number;
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerActivityData = PaginationMeta & {
  data?: StreamSession[];
};

export interface GetStreamerScheduleParams {
  /**
   * TikTok username of the streamer
   * @example "glubglub...o3o"
   */
  username: string;
}

export type GetStreamerScheduleData = ScheduleDay[];

export namespace Streamer {
  /**
   * @description Returns aggregated statistics for a specific streamer including diamonds, gifts, messages, and battle performance
   * @tags Streamer
   * @name GetStreamerStats
   * @summary Get streamer overview stats
   * @request GET:/api/streamer/{username}/stats
   */
  export namespace GetStreamerStats {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerStatsData;
  }

  /**
   * @description Returns daily diamond earnings for the last 30 days
   * @tags Streamer
   * @name GetStreamerEarnings
   * @summary Get streamer daily earnings
   * @request GET:/api/streamer/{username}/earnings
   */
  export namespace GetStreamerEarnings {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerEarningsData;
  }

  /**
   * @description Returns top 10 users who gifted the most diamonds to this streamer
   * @tags Streamer
   * @name GetStreamerTopGifters
   * @summary Get streamer's top gifters
   * @request GET:/api/streamer/{username}/top-gifters
   */
  export namespace GetStreamerTopGifters {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerTopGiftersData;
  }

  /**
   * @description Returns paginated list of battles ordered by most recent. Based on battleStart events, LEFT JOINed with battleEnd. Each battle has a status: "completed" (battleEnd received), "live" (started <10min ago, no battleEnd yet), or "interrupted" (no battleEnd, old). Scores and battle_won are 0 for non-completed battles.
   * @tags Streamer
   * @name GetStreamerBattles
   * @summary Get streamer's battle history
   * @request GET:/api/streamer/{username}/battles
   */
  export namespace GetStreamerBattles {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {
      /**
       * Number of items per page (max 50)
       * @min 1
       * @max 50
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * Number of items to skip for pagination
       * @min 0
       * @default 0
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerBattlesData;
  }

  /**
   * @description Returns paginated list of opponents the streamer has battled against most frequently
   * @tags Streamer
   * @name GetStreamerTopOpponents
   * @summary Get streamer's top opponents
   * @request GET:/api/streamer/{username}/top-opponents
   */
  export namespace GetStreamerTopOpponents {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {
      /**
       * Number of items per page (max 50)
       * @min 1
       * @max 50
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * Number of items to skip for pagination
       * @min 0
       * @default 0
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerTopOpponentsData;
  }

  /**
   * @description Returns paginated stream sessions with viewer counts and earnings per session
   * @tags Streamer
   * @name GetStreamerActivity
   * @summary Get streamer's stream activity
   * @request GET:/api/streamer/{username}/activity
   */
  export namespace GetStreamerActivity {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {
      /**
       * Number of sessions per page (max 100)
       * @min 1
       * @max 100
       * @default 20
       */
      limit?: number;
      /**
       * Number of items to skip for pagination
       * @min 0
       * @default 0
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerActivityData;
  }

  /**
   * @description Returns aggregated streaming hours by day of week
   * @tags Streamer
   * @name GetStreamerSchedule
   * @summary Get streamer's streaming schedule
   * @request GET:/api/streamer/{username}/schedule
   */
  export namespace GetStreamerSchedule {
    export type RequestParams = {
      /**
       * TikTok username of the streamer
       * @example "glubglub...o3o"
       */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamerScheduleData;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8082",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title TikTok Live Analytics API
 * @version 1.0.0
 * @baseUrl http://localhost:8082
 *
 * API for querying TikTok Live stream recording analytics data
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  streamer = {
    /**
     * @description Returns aggregated statistics for a specific streamer including diamonds, gifts, messages, and battle performance
     *
     * @tags Streamer
     * @name GetStreamerStats
     * @summary Get streamer overview stats
     * @request GET:/api/streamer/{username}/stats
     */
    getStreamerStats: (
      { username, ...query }: GetStreamerStatsParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerStatsData, Error>({
        path: `/api/streamer/${username}/stats`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns daily diamond earnings for the last 30 days
     *
     * @tags Streamer
     * @name GetStreamerEarnings
     * @summary Get streamer daily earnings
     * @request GET:/api/streamer/{username}/earnings
     */
    getStreamerEarnings: (
      { username, ...query }: GetStreamerEarningsParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerEarningsData, Error>({
        path: `/api/streamer/${username}/earnings`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns top 10 users who gifted the most diamonds to this streamer
     *
     * @tags Streamer
     * @name GetStreamerTopGifters
     * @summary Get streamer's top gifters
     * @request GET:/api/streamer/{username}/top-gifters
     */
    getStreamerTopGifters: (
      { username, ...query }: GetStreamerTopGiftersParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerTopGiftersData, Error>({
        path: `/api/streamer/${username}/top-gifters`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns paginated list of battles ordered by most recent. Based on battleStart events, LEFT JOINed with battleEnd. Each battle has a status: "completed" (battleEnd received), "live" (started <10min ago, no battleEnd yet), or "interrupted" (no battleEnd, old). Scores and battle_won are 0 for non-completed battles.
     *
     * @tags Streamer
     * @name GetStreamerBattles
     * @summary Get streamer's battle history
     * @request GET:/api/streamer/{username}/battles
     */
    getStreamerBattles: (
      { username, ...query }: GetStreamerBattlesParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerBattlesData, Error>({
        path: `/api/streamer/${username}/battles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns paginated list of opponents the streamer has battled against most frequently
     *
     * @tags Streamer
     * @name GetStreamerTopOpponents
     * @summary Get streamer's top opponents
     * @request GET:/api/streamer/{username}/top-opponents
     */
    getStreamerTopOpponents: (
      { username, ...query }: GetStreamerTopOpponentsParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerTopOpponentsData, Error>({
        path: `/api/streamer/${username}/top-opponents`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns paginated stream sessions with viewer counts and earnings per session
     *
     * @tags Streamer
     * @name GetStreamerActivity
     * @summary Get streamer's stream activity
     * @request GET:/api/streamer/{username}/activity
     */
    getStreamerActivity: (
      { username, ...query }: GetStreamerActivityParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerActivityData, Error>({
        path: `/api/streamer/${username}/activity`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns aggregated streaming hours by day of week
     *
     * @tags Streamer
     * @name GetStreamerSchedule
     * @summary Get streamer's streaming schedule
     * @request GET:/api/streamer/{username}/schedule
     */
    getStreamerSchedule: (
      { username, ...query }: GetStreamerScheduleParams,
      params: RequestParams = {},
    ) =>
      this.request<GetStreamerScheduleData, Error>({
        path: `/api/streamer/${username}/schedule`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
