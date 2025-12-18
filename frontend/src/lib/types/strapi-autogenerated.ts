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

export interface Error {
  data?: object | object[] | null;
  error: {
    status?: number;
    name?: string;
    message?: string;
    details?: object;
  };
}

export interface SourceRequest {
  data: {
    username?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface SourceListResponse {
  data?: Source[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Source {
  id?: number;
  documentId?: string;
  username?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: number;
    documentId?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    /** @format email */
    email?: string;
    resetPasswordToken?: string;
    registrationToken?: string;
    isActive?: boolean;
    roles?: {
      id?: number;
      documentId?: string;
      name?: string;
      code?: string;
      description?: string;
      users?: {
        id?: number;
        documentId?: string;
      }[];
      permissions?: {
        id?: number;
        documentId?: string;
        action?: string;
        actionParameters?: any;
        subject?: string;
        properties?: any;
        conditions?: any;
        role?: {
          id?: number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: number;
          documentId?: string;
        };
        updatedBy?: {
          id?: number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: number;
          documentId?: string;
        }[];
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: number;
        documentId?: string;
      };
      updatedBy?: {
        id?: number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: number;
        documentId?: string;
      }[];
    }[];
    blocked?: boolean;
    preferedLanguage?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: number;
      documentId?: string;
    };
    updatedBy?: {
      id?: number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: number;
      documentId?: string;
    }[];
  };
  updatedBy?: {
    id?: number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: number;
    documentId?: string;
    username?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: number;
      documentId?: string;
    };
    updatedBy?: {
      id?: number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: number;
      documentId?: string;
    }[];
  }[];
}

export interface SourceResponse {
  data?: Source;
  meta?: object;
}

export interface UploadFile {
  id?: number;
  name?: string;
  alternativeText?: string;
  caption?: string;
  /** @format integer */
  width?: number;
  /** @format integer */
  height?: number;
  formats?: number;
  hash?: string;
  ext?: string;
  mime?: string;
  /** @format double */
  size?: number;
  url?: string;
  previewUrl?: string;
  provider?: string;
  provider_metadata?: object;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UsersPermissionsRole {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UsersPermissionsUser {
  /** @example 1 */
  id?: number;
  /** @example "foo.bar" */
  username?: string;
  /** @example "foo.bar@strapi.io" */
  email?: string;
  /** @example "local" */
  provider?: string;
  /** @example true */
  confirmed?: boolean;
  /** @example false */
  blocked?: boolean;
  /**
   * @format date-time
   * @example "2022-06-02T08:32:06.258Z"
   */
  createdAt?: string;
  /**
   * @format date-time
   * @example "2022-06-02T08:32:06.267Z"
   */
  updatedAt?: string;
}

export interface UsersPermissionsUserRegistration {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" */
  jwt?: string;
  user?: UsersPermissionsUser;
}

export type UsersPermissionsPermissionsTree = Record<
  string,
  {
    /** every controller of the api */
    controllers?: Record<
      string,
      Record<
        string,
        {
          enabled?: boolean;
          policy?: string;
        }
      >
    >;
  }
>;

export interface GetSourcesParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetSourcesData = SourceListResponse;

export type PostSourcesData = SourceResponse;

export interface GetSourcesIdParams {
  id: number;
}

export type GetSourcesIdData = SourceResponse;

export interface PutSourcesIdParams {
  id: number;
}

export type PutSourcesIdData = SourceResponse;

export interface DeleteSourcesIdParams {
  id: number;
}

/** @format int64 */
export type DeleteSourcesIdData = number;

/** Upload files */
export interface UploadCreatePayload {
  /** The folder where the file(s) will be uploaded to (only supported on strapi-provider-upload-aws-s3). */
  path?: string;
  /** The ID of the entry which the file(s) will be linked to */
  refId?: string;
  /** The unique ID (uid) of the model which the file(s) will be linked to (api::restaurant.restaurant). */
  ref?: string;
  /** The field of the entry which the file(s) will be precisely linked to. */
  field?: string;
  files: File[];
}

export type UploadCreateData = UploadFile[];

/** Upload files */
export interface UploadIdCreatePayload {
  fileInfo?: {
    name?: string;
    alternativeText?: string;
    caption?: string;
  };
  /** @format binary */
  files?: File;
}

export interface UploadIdCreateParams {
  id: string;
}

export type UploadIdCreateData = UploadFile[];

export type FilesListData = UploadFile[];

export interface FilesDetailParams {
  id: string;
}

export type FilesDetailData = UploadFile;

export interface FilesDeleteParams {
  id: string;
}

export type FilesDeleteData = UploadFile;

export interface ConnectDetailParams {
  /**
   * Provider name
   * @pattern .*
   */
  provider: string;
}

export interface LocalCreatePayload {
  identifier?: string;
  password?: string;
}

export type LocalCreateData = UsersPermissionsUserRegistration;

export interface LocalRegisterCreatePayload {
  username?: string;
  email?: string;
  password?: string;
}

export type LocalRegisterCreateData = UsersPermissionsUserRegistration;

export interface CallbackListParams {
  /** Provider name */
  provider: string;
}

export type CallbackListData = UsersPermissionsUserRegistration;

export enum OkEnum {
  True = true,
}

export interface ForgotPasswordCreatePayload {
  email?: string;
}

export interface ForgotPasswordCreateData {
  ok?: OkEnum;
}

export interface ResetPasswordCreatePayload {
  password?: string;
  passwordConfirmation?: string;
  code?: string;
}

export type ResetPasswordCreateData = UsersPermissionsUserRegistration;

export interface ChangePasswordCreatePayload {
  password: string;
  currentPassword: string;
  passwordConfirmation: string;
}

export type ChangePasswordCreateData = UsersPermissionsUserRegistration;

export interface EmailConfirmationListParams {
  /** confirmation token received by email */
  confirmation?: string;
}

export enum SentEnum {
  True = true,
}

export interface SendEmailConfirmationCreatePayload {
  email?: string;
}

export interface SendEmailConfirmationCreateData {
  email?: string;
  sent?: SentEnum;
}

export interface PermissionsListData {
  permissions?: UsersPermissionsPermissionsTree;
}

export interface RolesListData {
  roles?: (UsersPermissionsRole & {
    nb_users?: number;
  })[];
}

export enum OkEnum1 {
  True = true,
}

export interface RolesCreateData {
  ok?: OkEnum1;
}

export interface RolesDetailParams {
  /** role Id */
  id: string;
}

export interface RolesDetailData {
  role?: UsersPermissionsRole;
}

export enum OkEnum2 {
  True = true,
}

export interface RolesUpdateParams {
  /** role Id */
  role: string;
}

export interface RolesUpdateData {
  ok?: OkEnum2;
}

export enum OkEnum3 {
  True = true,
}

export interface RolesDeleteParams {
  /** role Id */
  role: string;
}

export interface RolesDeleteData {
  ok?: OkEnum3;
}

export type UsersListData = UsersPermissionsUser[];

export interface UsersCreatePayload {
  email: string;
  username: string;
  password: string;
}

export type UsersCreateData = UsersPermissionsUser & {
  role?: UsersPermissionsRole;
};

export interface UsersDetailParams {
  /** user Id */
  id: string;
}

export type UsersDetailData = UsersPermissionsUser;

export interface UsersUpdatePayload {
  email: string;
  username: string;
  password: string;
}

export interface UsersUpdateParams {
  /** user Id */
  id: string;
}

export type UsersUpdateData = UsersPermissionsUser & {
  role?: UsersPermissionsRole;
};

export interface UsersDeleteParams {
  /** user Id */
  id: string;
}

export type UsersDeleteData = UsersPermissionsUser;

export type GetUsersPermissionsUsersRolesData = UsersPermissionsUser;

export type CountListData = number;

export namespace Source {
  /**
   * No description
   * @tags Source
   * @name GetSources
   * @request GET:/sources
   * @secure
   */
  export namespace GetSources {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSourcesData;
  }

  /**
   * No description
   * @tags Source
   * @name PostSources
   * @request POST:/sources
   * @secure
   */
  export namespace PostSources {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SourceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostSourcesData;
  }

  /**
   * No description
   * @tags Source
   * @name GetSourcesId
   * @request GET:/sources/{id}
   * @secure
   */
  export namespace GetSourcesId {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSourcesIdData;
  }

  /**
   * No description
   * @tags Source
   * @name PutSourcesId
   * @request PUT:/sources/{id}
   * @secure
   */
  export namespace PutSourcesId {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = SourceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutSourcesIdData;
  }

  /**
   * No description
   * @tags Source
   * @name DeleteSourcesId
   * @request DELETE:/sources/{id}
   * @secure
   */
  export namespace DeleteSourcesId {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteSourcesIdData;
  }
}

export namespace UploadFile {
  /**
   * @description Upload files
   * @tags Upload - File
   * @name UploadCreate
   * @request POST:/upload
   * @secure
   */
  export namespace UploadCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UploadCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UploadCreateData;
  }

  /**
   * @description Upload file information
   * @tags Upload - File
   * @name UploadIdCreate
   * @request POST:/upload?id={id}
   * @secure
   */
  export namespace UploadIdCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {
      /** File id */
      id: string;
    };
    export type RequestBody = UploadIdCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UploadIdCreateData;
  }

  /**
   * No description
   * @tags Upload - File
   * @name FilesList
   * @request GET:/upload/files
   * @secure
   */
  export namespace FilesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FilesListData;
  }

  /**
   * No description
   * @tags Upload - File
   * @name FilesDetail
   * @request GET:/upload/files/{id}
   * @secure
   */
  export namespace FilesDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FilesDetailData;
  }

  /**
   * No description
   * @tags Upload - File
   * @name FilesDelete
   * @request DELETE:/upload/files/{id}
   * @secure
   */
  export namespace FilesDelete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FilesDeleteData;
  }
}

export namespace UsersPermissionsAuth {
  /**
   * @description Redirects to provider login before being redirect to /auth/{provider}/callback
   * @tags Users-Permissions - Auth
   * @name ConnectDetail
   * @summary Login with a provider
   * @request GET:/connect/{provider}
   * @secure
   */
  export namespace ConnectDetail {
    export type RequestParams = {
      /**
       * Provider name
       * @pattern .*
       */
      provider: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * @description Returns a jwt token and user info
   * @tags Users-Permissions - Auth
   * @name LocalCreate
   * @summary Local login
   * @request POST:/auth/local
   * @secure
   */
  export namespace LocalCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LocalCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = LocalCreateData;
  }

  /**
   * @description Returns a jwt token and user info
   * @tags Users-Permissions - Auth
   * @name LocalRegisterCreate
   * @summary Register a user
   * @request POST:/auth/local/register
   * @secure
   */
  export namespace LocalRegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LocalRegisterCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = LocalRegisterCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name CallbackList
   * @summary Default Callback from provider auth
   * @request GET:/auth/{provider}/callback
   * @secure
   */
  export namespace CallbackList {
    export type RequestParams = {
      /** Provider name */
      provider: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CallbackListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name ForgotPasswordCreate
   * @summary Send rest password email
   * @request POST:/auth/forgot-password
   * @secure
   */
  export namespace ForgotPasswordCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ForgotPasswordCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ForgotPasswordCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name ResetPasswordCreate
   * @summary Rest user password
   * @request POST:/auth/reset-password
   * @secure
   */
  export namespace ResetPasswordCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ResetPasswordCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ResetPasswordCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name ChangePasswordCreate
   * @summary Update user's own password
   * @request POST:/auth/change-password
   * @secure
   */
  export namespace ChangePasswordCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangePasswordCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangePasswordCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name EmailConfirmationList
   * @summary Confirm user email
   * @request GET:/auth/email-confirmation
   * @secure
   */
  export namespace EmailConfirmationList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** confirmation token received by email */
      confirmation?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name SendEmailConfirmationCreate
   * @summary Send confirmation email
   * @request POST:/auth/send-email-confirmation
   * @secure
   */
  export namespace SendEmailConfirmationCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendEmailConfirmationCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = SendEmailConfirmationCreateData;
  }
}

export namespace UsersPermissionsUsersRoles {
  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name PermissionsList
   * @summary Get default generated permissions
   * @request GET:/users-permissions/permissions
   * @secure
   */
  export namespace PermissionsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PermissionsListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesList
   * @summary List roles
   * @request GET:/users-permissions/roles
   * @secure
   */
  export namespace RolesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RolesListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesCreate
   * @summary Create a role
   * @request POST:/users-permissions/roles
   * @secure
   */
  export namespace RolesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      name?: string;
      description?: string;
      type?: string;
      permissions?: UsersPermissionsPermissionsTree;
    };
    export type RequestHeaders = {};
    export type ResponseBody = RolesCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesDetail
   * @summary Get a role
   * @request GET:/users-permissions/roles/{id}
   * @secure
   */
  export namespace RolesDetail {
    export type RequestParams = {
      /** role Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RolesDetailData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesUpdate
   * @summary Update a role
   * @request PUT:/users-permissions/roles/{role}
   * @secure
   */
  export namespace RolesUpdate {
    export type RequestParams = {
      /** role Id */
      role: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {
      name?: string;
      description?: string;
      type?: string;
      permissions?: UsersPermissionsPermissionsTree;
    };
    export type RequestHeaders = {};
    export type ResponseBody = RolesUpdateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesDelete
   * @summary Delete a role
   * @request DELETE:/users-permissions/roles/{role}
   * @secure
   */
  export namespace RolesDelete {
    export type RequestParams = {
      /** role Id */
      role: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RolesDeleteData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersList
   * @summary Get list of users
   * @request GET:/users
   * @secure
   */
  export namespace UsersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersCreate
   * @summary Create a user
   * @request POST:/users
   * @secure
   */
  export namespace UsersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UsersCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UsersCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersDetail
   * @summary Get a user
   * @request GET:/users/{id}
   * @secure
   */
  export namespace UsersDetail {
    export type RequestParams = {
      /** user Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersDetailData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersUpdate
   * @summary Update a user
   * @request PUT:/users/{id}
   * @secure
   */
  export namespace UsersUpdate {
    export type RequestParams = {
      /** user Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UsersUpdatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UsersUpdateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersDelete
   * @summary Delete a user
   * @request DELETE:/users/{id}
   * @secure
   */
  export namespace UsersDelete {
    export type RequestParams = {
      /** user Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersDeleteData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name GetUsersPermissionsUsersRoles
   * @summary Get authenticated user info
   * @request GET:/users/me
   * @secure
   */
  export namespace GetUsersPermissionsUsersRoles {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUsersPermissionsUsersRolesData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name CountList
   * @summary Get user count
   * @request GET:/users/count
   * @secure
   */
  export namespace CountList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CountListData;
  }
}
