export default ({ env }) => ({
  admin: {
    forgotPassword: {
      from: env("EMAIL_FROM", "noreply@livestreamrecorder.com"),
      replyTo: env("EMAIL_REPLY_TO", "contact@livestreamrecorder.com"),
    },
  },
  email: {
    config: {
      provider: "strapi-provider-email-extra",
      providerOptions: {
        defaultProvider: "strapi-provider-email-resend",
        providers: {
          "strapi-provider-email-resend": {
            provider: "strapi-provider-email-resend",
            providerOptions: {
              apiKey: env("RESEND_API_KEY"),
            },
          },
        },
        dynamicTemplates: {
          enabled: true,
          collection: "api::email-template.email-template",
          subjectMatcherField: "subjectMatcher",
        },
      },
      settings: {
        defaultTo: env("EMAIL_DEFAULT_TO", "contact@livestreamrecorder.com"),
        defaultFrom: env("EMAIL_FROM", "noreply@livestreamrecorder.com"),
        defaultFromName: env("EMAIL_FROM_NAME", "Live Stream Recorder"),
      },
    },
  },
  upload: {
    config: {
      provider: "@strapi/provider-upload-aws-s3",
      providerOptions: {
        baseUrl: env("AWS_BUCKET_URL"),
        s3Options: {
          credentials: {
            accessKeyId: env("AWS_ACCESS_KEY_ID"),
            secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
          },
          endpoint: env("AWS_ENDPOINT"),
          region: env("AWS_REGION"),
          params: {
            Bucket: env("AWS_BUCKET"),
          },
          forcePathStyle: true,
        },
      },
    },
  },
  documentation: {
    enabled: true,
    config: {
      "x-strapi-config": {
        mutateDocumentation: (draft) => {
          // STEP 1 — extract the platform enum from Follower.properties.type
          // into a top-level FollowerTypeEnum schema. This is the SINGLE
          // source of truth for the platform enum values; do not duplicate
          // them anywhere else in this file.
          if (draft.components.schemas.Follower?.properties?.type) {
            draft.components.schemas.FollowerTypeEnum =
              draft.components.schemas.Follower.properties.type;
            draft.components.schemas.Follower.properties.type = {
              $ref: "#/components/schemas/FollowerTypeEnum",
            };
          }

          // STEP 2 — define ApiTokenTypeEnum as a top-level schema so we
          // can $ref it instead of having the admin api-token's inline
          // `type` enum (read-only / full-access / custom) re-named to
          // something that collides with FollowerTypeEnum.
          draft.components.schemas.ApiTokenTypeEnum = {
            type: "string",
            enum: ["read-only", "full-access", "custom"],
          };

          // STEP 3 — walk the entire spec and replace ALL deeply-nested
          // inline enums with $refs to the canonical top-level schemas.
          // Without this, swagger-typescript-api sees N copies of the
          // inline platform enum (one under each nested follower in
          // Activity / Recording / etc.) and generates
          // FollowerTypeEnum1, FollowerTypeEnum2, … which clobber the
          // canonical FollowerTypeEnum.
          //
          // STRICT matching: the platform-enum check compares against the
          // canonical FollowerTypeEnum.enum set we extracted in step 1.
          // Loose matching like `enum.includes("tiktok")` accidentally hits
          // SocialAccount.provider (which lists google/apple/facebook/tiktok)
          // — that's a different enum and must NOT be rewritten to
          // FollowerTypeEnum.
          const canonicalPlatformEnum: string[] =
            (draft.components.schemas.FollowerTypeEnum &&
              draft.components.schemas.FollowerTypeEnum.enum) ||
            [];
          const canonicalPlatformSet = new Set(canonicalPlatformEnum);
          const isCanonicalPlatformEnum = (enumArr: string[]) => {
            if (!Array.isArray(enumArr) || enumArr.length === 0) return false;
            // Must be exactly the canonical set: same length AND every value
            // is in the canonical set. This excludes SocialAccount.provider
            // (which has google/apple/facebook/tiktok — overlaps tiktok but
            // contains non-platform values and is shorter).
            if (enumArr.length !== canonicalPlatformSet.size) return false;
            for (const v of enumArr) if (!canonicalPlatformSet.has(v)) return false;
            return true;
          };

          const rewriteInlineEnums = (node: any) => {
            if (!node || typeof node !== "object") return;
            if (Array.isArray(node)) {
              for (const item of node) rewriteInlineEnums(item);
              return;
            }
            for (const key of Object.keys(node)) {
              // Don't rewrite the canonical enum schemas themselves —
              // otherwise they get replaced with $refs to themselves.
              if (key === "FollowerTypeEnum" || key === "ApiTokenTypeEnum") {
                continue;
              }
              const child = node[key];
              if (
                child &&
                typeof child === "object" &&
                child.type === "string" &&
                Array.isArray(child.enum)
              ) {
                // Access-role enum (admin api-token).
                if (
                  child.enum.length === 3 &&
                  child.enum.includes("read-only") &&
                  child.enum.includes("full-access") &&
                  child.enum.includes("custom")
                ) {
                  node[key] = {
                    $ref: "#/components/schemas/ApiTokenTypeEnum",
                  };
                  continue;
                }
                // Platform enum (Follower.type) — strict match against the
                // canonical FollowerTypeEnum.enum extracted in step 1.
                if (isCanonicalPlatformEnum(child.enum)) {
                  node[key] = {
                    $ref: "#/components/schemas/FollowerTypeEnum",
                  };
                  continue;
                }
              }
              rewriteInlineEnums(child);
            }
          };
          rewriteInlineEnums(draft);

          draft.paths[
            "/followers/connect-user-with-follower/{userDocumentId}"
          ] = {
            post: {
              tags: ["Follower"],
              operationId: "connectUserWithFollower",
              summary: "Connect a user with a follower",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "userDocumentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "The user's document ID",
                },
              ],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["username", "type"],
                      properties: {
                        username: { type: "string" },
                        type: { $ref: "#/components/schemas/FollowerTypeEnum" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: { $ref: "#/components/schemas/Follower" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
                "404": { description: "Follower not found" },
              },
            },
          };

          draft.paths["/send-email"] = {
            post: {
              tags: ["Email"],
              operationId: "sendEmail",
              summary: "Send a contact form email",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["email", "message"],
                      properties: {
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        subject: { type: "string" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Email sent successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          message: { type: "string" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Missing required fields" },
                "500": { description: "Failed to send email" },
              },
            },
          };

          // Endpoint: PUT /user/update
          draft.paths["/user/update"] = {
            put: {
              tags: ["User"],
              operationId: "updateUser",
              summary: "Update current user's username",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["username"],
                      properties: {
                        username: {
                          type: "string",
                          minLength: 3,
                          maxLength: 30,
                          description: "New username (3-30 characters)",
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Username updated successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              id: { type: "integer" },
                              documentId: { type: "string" },
                              username: { type: "string" },
                              email: { type: "string", format: "email" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                "400": {
                  description: "Invalid username or username already taken",
                },
                "401": { description: "Unauthorized - must be logged in" },
              },
            },
          };

          // Endpoint: DELETE /user/destroy
          draft.paths["/user/destroy"] = {
            delete: {
              tags: ["User"],
              operationId: "destroyUser",
              summary: "Delete current user's account",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Account deleted successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized - must be logged in" },
              },
            },
          };

          // Endpoint: POST /user/notify-streamers-live
          draft.paths["/user/notify-streamers-live"] = {
            post: {
              tags: ["User"],
              operationId: "notifyStreamersLive",
              summary:
                "Bulk notify followers about streamers that just went live",
              description:
                "Called by n8n with the list of streamers it just confirmed live. Returns 202 immediately and processes in the background: dedups against recent recordings (last 1h), fetches subscribers, fans out Web Push.",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["username", "type"],
                        properties: {
                          username: { type: "string" },
                          type: {
                            $ref: "#/components/schemas/FollowerTypeEnum",
                          },
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                "202": {
                  description: "Accepted — processing in background",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          accepted: { type: "integer" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Body must be a non-empty array" },
                "401": { description: "Unauthorized" },
              },
            },
          };

          // Endpoint: POST /user/test-push
          draft.paths["/user/test-push"] = {
            post: {
              tags: ["User"],
              operationId: "testPushNotification",
              summary: "Send a test push notification to the current user",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Notification sent",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "400": {
                  description:
                    "No subscription saved or subscription has expired",
                },
                "401": { description: "Unauthorized - must be logged in" },
                "500": {
                  description: "VAPID not configured or push service error",
                },
              },
            },
          };

          // Endpoint: PUT/DELETE /user/push-subscription
          draft.paths["/user/push-subscription"] = {
            put: {
              tags: ["User"],
              operationId: "setPushSubscription",
              summary:
                "Save the browser's Web Push subscription for the current user",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["endpoint", "keys"],
                      properties: {
                        endpoint: {
                          type: "string",
                          format: "uri",
                          description: "Push service endpoint URL",
                        },
                        expirationTime: {
                          type: "integer",
                          nullable: true,
                        },
                        keys: {
                          type: "object",
                          required: ["p256dh", "auth"],
                          properties: {
                            p256dh: { type: "string" },
                            auth: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Subscription saved",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Invalid push subscription" },
                "401": { description: "Unauthorized - must be logged in" },
              },
            },
            delete: {
              tags: ["User"],
              operationId: "deletePushSubscription",
              summary:
                "Clear the saved Web Push subscription for the current user",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Subscription cleared",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized - must be logged in" },
              },
            },
          };

          // Endpoint: GET/POST /social-accounts/me
          draft.paths["/social-accounts/me"] = {
            get: {
              tags: ["SocialAccount"],
              operationId: "meGetSocialAccounts",
              summary: "Get current user's social accounts",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "provider",
                  in: "query",
                  required: false,
                  schema: {
                    type: "string",
                    enum: ["google", "apple", "facebook", "tiktok"],
                  },
                  description: "Filter by provider",
                },
              ],
              responses: {
                "200": {
                  description: "Social accounts list",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/SocialAccount",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
            post: {
              ...draft.paths["/social-accounts"]?.post,
              operationId: "mePostSocialAccounts",
              summary: "Create social account for current user",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/social-accounts"]?.post?.responses,
                "400": {
                  description: "You already have this provider linked",
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          draft.paths["/social-accounts/me/{id}"] = {
            put: {
              ...draft.paths["/social-accounts/{id}"]?.put,
              operationId: "mePutSocialAccountsId",
              summary: "Update current user's social account",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/social-accounts/{id}"]?.put?.responses,
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden - not your social account" },
              },
            },
            delete: {
              ...draft.paths["/social-accounts/{id}"]?.delete,
              operationId: "meDeleteSocialAccountsId",
              summary: "Delete current user's social account",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/social-accounts/{id}"]?.delete?.responses,
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden - not your social account" },
              },
            },
          };

          // ClipWithShare schema for /clips/me
          draft.components.schemas.ClipWithShare = {
            allOf: [
              { $ref: "#/components/schemas/Clip" },
              {
                type: "object",
                properties: {
                  clipShares: {
                    type: "object",
                    additionalProperties: {
                      $ref: "#/components/schemas/ClipShare",
                    },
                    description: "Shares grouped by platform (e.g. { tiktok: {...}, youtube: {...} })",
                  },
                },
              },
            ],
          };

          draft.paths["/clips/me"] = {
            get: {
              ...draft.paths["/clips"].get,
              operationId: "meGetClips",
              summary: "Get clips belonging to current user's followers",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/ClipWithShare",
                            },
                          },
                          meta: draft.components.schemas.FollowerListResponse
                            .properties.meta,
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          draft.paths["/clips/me/{id}"] = {
            get: {
              ...draft.paths["/clips/{id}"]?.get,
              operationId: "meGetClipOne",
              summary:
                "Get a single clip belonging to current user's followers",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: { $ref: "#/components/schemas/ClipWithShare" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
                "404": { description: "Not found" },
              },
            },
          };

          // Endpoint: POST /clip-shares/me

          draft.paths["/clip-shares/me"] = {
            post: {
              ...draft.paths["/clip-shares"].post,
              operationId: "mePostClipShares",
              summary: "Create a clip share for current user",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/clip-shares"].post.responses,
                "401": { description: "Unauthorized" },
              },
            },
          };

          draft.paths["/clip-shares/me/{id}"] = {
            put: {
              ...draft.paths["/clip-shares/{id}"].put,
              operationId: "mePutClipSharesId",
              summary: "Update current user's clip share",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/clip-shares/{id}"].put.responses,
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden - not your clip share" },
              },
            },
            delete: {
              ...draft.paths["/clip-shares/{id}"].delete,
              operationId: "meDeleteClipSharesId",
              summary: "Delete current user's clip share",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/clip-shares/{id}"].delete.responses,
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden - not your clip share" },
              },
            },
          };

          // Endpoint: GET/POST /ai-requests/me
          draft.paths["/ai-requests/me"] = {
            get: {
              ...draft.paths["/ai-requests"]?.get,
              operationId: "meGetAiRequests",
              summary: "Get current user's AI requests",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/ai-requests"]?.get?.responses,
                "401": { description: "Unauthorized" },
              },
            },
            post: {
              ...draft.paths["/ai-requests"]?.post,
              operationId: "mePostAiRequests",
              summary: "Create an AI request for current user",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/ai-requests"]?.post?.responses,
                "401": { description: "Unauthorized" },
              },
            },
          };

          draft.paths["/ai-requests/me/{id}"] = {
            get: {
              ...draft.paths["/ai-requests/{id}"]?.get,
              operationId: "meGetAiRequestsId",
              summary: "Get a specific AI request for current user",
              security: [{ bearerAuth: [] }],
              responses: {
                ...draft.paths["/ai-requests/{id}"]?.get?.responses,
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden - not your AI request" },
              },
            },
          };

          // Fix populate parameter type for all GET endpoints
          Object.keys(draft.paths).forEach((path) => {
            const get = draft.paths[path]?.get;
            if (get?.parameters) {
              get.parameters = get.parameters.map((param: any) => {
                if (param.name === "populate") {
                  return {
                    ...param,
                    schema: {
                      oneOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } },
                        { type: "object" },
                      ],
                    },
                  };
                }
                return param;
              });
            }
          });

          // Fix id type for all /{id} endpoints (Strapi v5 uses documentId which is string)
          Object.keys(draft.paths).forEach((path) => {
            if (path.match(/\/\{id\}$/)) {
              ["get", "put", "delete"].forEach((method) => {
                const endpoint = draft.paths[path]?.[method];
                if (endpoint?.parameters) {
                  endpoint.parameters = endpoint.parameters.map(
                    (param: any) => {
                      if (param.name === "id" && param.in === "path") {
                        return { ...param, schema: { type: "string" } };
                      }
                      return param;
                    },
                  );
                }
              });
            }
          });

          draft.paths["/clips/random"] = {
            get: {
              tags: ["Clip"],
              operationId: "getRandomClips",
              summary: "Get random clips (one per user)",
              parameters: [
                {
                  name: "limit",
                  in: "query",
                  required: false,
                  schema: { type: "integer", default: 12 },
                  description: "Number of clips to return",
                },
              ],
              responses: {
                "200": {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Clip" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          };

          // Add populate to /XXX/{id}
          const populateParam = draft.paths["/recordings"].get.parameters.find(
            (param: any) => param.name === "populate",
          );

          draft.paths["/recordings/{id}"].get.parameters.push(populateParam);

          // Define scope enum once
          draft.components.schemas.ScopeEnum = {
            type: "string",
            enum: ["following", "discover"],
            description: "Filter by follow status",
          };

          // Scope parameter referencing shared enum
          const scopeParam = {
            name: "scope",
            in: "query",
            required: false,
            schema: {
              $ref: "#/components/schemas/ScopeEnum",
            },
            description:
              "Filter by follow status: 'following' (only followed), 'discover' (not followed), or omit for all",
          };

          // Add hasRecordings param
          const hasRecordingsParam = {
            name: "hasRecordings",
            in: "query",
            required: false,
            schema: { type: "boolean" },
            description:
              "Filter to only return followers with at least 1 recording",
          };

          const favoritesParam = {
            name: "favorites",
            in: "query",
            required: false,
            schema: { type: "boolean" },
            description: "Filter to only return favorited followers",
          };

          // Extend Follower with isFollowing and totalRecordings
          draft.components.schemas.FollowerWithMeta = {
            allOf: [
              {
                type: "object",
                properties: {
                  isFollowing: { type: "boolean" },
                  isFavorite: { type: "boolean" },
                  totalRecordings: { type: "integer" },
                  recordings: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Recording",
                    },
                  },
                },
              },
              { $ref: "#/components/schemas/Follower" },
            ],
          };

          // Add after FollowerWithMeta definition
          draft.components.schemas.BrowseFollowersResponse = {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/FollowerWithMeta",
                },
              },
              meta: draft.components.schemas.FollowerListResponse.properties
                .meta,
            },
          };

          // POST /followers/search — same query semantics as GET /followers
          // but body-based, to bypass URL-length limits when filters[id][$in]
          // contains many values (>~150 IDs hits nginx 8KB request-line cap).
          if (draft.paths["/followers"]?.get) {
            const getParams = draft.paths["/followers"].get.parameters || [];
            const bodyProps = {};
            for (const p of getParams) {
              if (p && p.name) {
                bodyProps[p.name] = p.schema || { type: "string" };
              }
            }
            draft.paths["/followers/search"] = {
              post: {
                tags: draft.paths["/followers"].get.tags,
                operationId: "searchFollowers",
                summary:
                  "Search followers via POST body (bypasses URL length limits)",
                requestBody: {
                  required: false,
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        additionalProperties: true,
                        properties: bodyProps,
                      },
                    },
                  },
                },
                responses: {
                  ...draft.paths["/followers"].get.responses,
                },
              },
            };
          }

          // Then in the endpoint
          if (draft.paths["/followers"]?.get) {
            draft.paths["/followers/browse"] = {
              get: {
                ...draft.paths["/followers"].get,
                operationId: "browseFollowers",
                summary:
                  "Browse followers with scope filtering (auth required)",
                security: [{ bearerAuth: [] }],
                parameters: [
                  ...(draft.paths["/followers"].get.parameters || []),
                  scopeParam,
                  hasRecordingsParam,
                  favoritesParam,
                ],
                responses: {
                  ...draft.paths["/followers"].get.responses,
                  "200": {
                    description: "OK",
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/BrowseFollowersResponse",
                        },
                      },
                    },
                  },
                  "401": { description: "Unauthorized" },
                },
              },
            };
          }

          // Fix Recording.sources schema
          if (draft.components.schemas.Recording?.properties) {
            delete draft.components.schemas.Recording.properties.sources;
            draft.components.schemas.Recording.properties.sources = {
              type: "array",
              items: { $ref: "#/components/schemas/Source" },
            };
          }

          // Fix Recording's nested follower type to use same enum
          if (
            draft.components.schemas.Recording?.properties?.follower?.properties
              ?.type
          ) {
            draft.components.schemas.Recording.properties.follower.properties.type =
              {
                $ref: "#/components/schemas/FollowerTypeEnum",
              };
          }

          // Endpoint: GET /recordings/browse - copy from /recordings and add scope
          if (draft.paths["/recordings"]?.get) {
            draft.paths["/recordings/browse"] = {
              get: {
                ...draft.paths["/recordings"].get,
                operationId: "browseRecordings",
                summary:
                  "Browse recordings with scope filtering (auth required)",
                security: [{ bearerAuth: [] }],
                parameters: [
                  ...(draft.paths["/recordings"].get.parameters || []),
                  scopeParam,
                  favoritesParam,
                ],
                responses: {
                  ...draft.paths["/recordings"].get.responses,
                  "401": { description: "Unauthorized" },
                },
              },
            };
          }

          // POST /recordings/search — body-based mirror of GET /recordings
          // (avoids URL-length limits when filters[follower][id][$in] holds many values)
          if (draft.paths["/recordings"]?.get) {
            const recParams = draft.paths["/recordings"].get.parameters || [];
            const recBodyProps = {};
            for (const p of recParams) {
              if (p && p.name) {
                recBodyProps[p.name] = p.schema || { type: "string" };
              }
            }
            draft.paths["/recordings/search"] = {
              post: {
                tags: draft.paths["/recordings"].get.tags,
                operationId: "searchRecordings",
                summary:
                  "Search recordings via POST body (bypasses URL length limits)",
                requestBody: {
                  required: false,
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        additionalProperties: true,
                        properties: recBodyProps,
                      },
                    },
                  },
                },
                responses: {
                  ...draft.paths["/recordings"].get.responses,
                },
              },
            };
          }

          // Define FollowRequestBody from scratch using refs
          draft.components.schemas.FollowRequestBody = {
            type: "object",
            required: ["username", "type"],
            properties: {
              username: { type: "string" },
              type: { $ref: "#/components/schemas/FollowerTypeEnum" },
            },
          };

          // Endpoint: POST /followers/follow
          draft.paths["/followers/follow"] = {
            post: {
              tags: ["Follower"],
              summary: "Follow a new account",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FollowRequestBody",
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: { $ref: "#/components/schemas/Follower" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          // Endpoint: DELETE /followers/unfollow/:id
          draft.paths["/followers/unfollow"] = {
            post: {
              tags: ["Follower"],
              summary: "Unfollow an account",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FollowRequestBody",
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
                "404": { description: "Not found" },
              },
            },
          };

          // Endpoint: POST /followers/favorite
          draft.paths["/followers/favorite"] = {
            post: {
              tags: ["Follower"],
              operationId: "favoriteFollower",
              summary: "Add a follower to favorites",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["documentId"],
                      properties: {
                        documentId: { type: "string" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
                "403": { description: "Must be following the creator first" },
              },
            },
          };

          // Endpoint: POST /followers/unfavorite
          draft.paths["/followers/unfavorite"] = {
            post: {
              tags: ["Follower"],
              operationId: "unfavoriteFollower",
              summary: "Remove a follower from favorites",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["documentId"],
                      properties: {
                        documentId: { type: "string" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          // Endpoint: POST /recordings/{documentId}/report
          draft.paths["/recordings/{documentId}/report"] = {
            post: {
              tags: ["Recording"],
              operationId: "reportRecording",
              summary: "Report a recording for moderation review",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Recording documentId",
                },
              ],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["reason", "reporter"],
                      properties: {
                        reason: {
                          type: "string",
                          enum: [
                            "sexual",
                            "violent",
                            "hateful",
                            "harmful",
                            "spam",
                          ],
                        },
                        locale: { type: "string" },
                        reporter: {
                          type: "object",
                          required: ["id", "username", "email"],
                          properties: {
                            id: { type: "integer" },
                            username: { type: "string" },
                            email: { type: "string", format: "email" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Report received",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Invalid report" },
                "401": { description: "Unauthorized" },
                "404": { description: "Recording not found" },
              },
            },
          };

          // Endpoint: POST /recordings/{documentId}/reset-counters
          draft.paths["/recordings/{documentId}/reset-counters"] = {
            post: {
              tags: ["Recording"],
              operationId: "resetRecordingCounters",
              summary: "Reset views_count and downloads_count to 0",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Recording documentId",
                },
              ],
              responses: {
                "200": {
                  description: "Counters reset",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Invalid documentId" },
              },
            },
          };

          // Endpoint: POST /clips/{documentId}/view
          draft.paths["/clips/{documentId}/view"] = {
            post: {
              tags: ["Clip"],
              operationId: "incrementClipView",
              summary: "Increment clip views_count by 1",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Clip documentId",
                },
              ],
              responses: {
                "200": {
                  description: "View counted",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { success: { type: "boolean" } },
                      },
                    },
                  },
                },
                "400": { description: "Invalid documentId" },
              },
            },
          };

          // Endpoint: POST /clips/{documentId}/download
          draft.paths["/clips/{documentId}/download"] = {
            post: {
              tags: ["Clip"],
              operationId: "incrementClipDownload",
              summary: "Increment clip downloads_count by 1",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Clip documentId",
                },
              ],
              responses: {
                "200": {
                  description: "Download counted",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { success: { type: "boolean" } },
                      },
                    },
                  },
                },
                "400": { description: "Invalid documentId" },
              },
            },
          };

          // Endpoint: POST /clips/{documentId}/report
          draft.paths["/clips/{documentId}/report"] = {
            post: {
              tags: ["Clip"],
              operationId: "reportClip",
              summary: "Report a clip for moderation review",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Clip documentId",
                },
              ],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["reason", "reporter"],
                      properties: {
                        reason: {
                          type: "string",
                          enum: [
                            "sexual",
                            "violent",
                            "hateful",
                            "harmful",
                            "spam",
                          ],
                        },
                        locale: { type: "string" },
                        reporter: {
                          type: "object",
                          required: ["id", "username", "email"],
                          properties: {
                            id: { type: "integer" },
                            username: { type: "string" },
                            email: { type: "string", format: "email" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Report received",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { success: { type: "boolean" } },
                      },
                    },
                  },
                },
                "400": { description: "Invalid report" },
                "401": { description: "Unauthorized" },
                "404": { description: "Clip not found" },
              },
            },
          };

          // Endpoint: POST /clips/{documentId}/reset-counters
          draft.paths["/clips/{documentId}/reset-counters"] = {
            post: {
              tags: ["Clip"],
              operationId: "resetClipCounters",
              summary: "Reset clip views_count and downloads_count to 0",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Clip documentId",
                },
              ],
              responses: {
                "200": {
                  description: "Counters reset",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { success: { type: "boolean" } },
                      },
                    },
                  },
                },
                "400": { description: "Invalid documentId" },
              },
            },
          };

          // Endpoint: POST /followers/{documentId}/block
          draft.paths["/followers/{documentId}/block"] = {
            post: {
              tags: ["Follower"],
              operationId: "blockFollower",
              summary:
                "Set follower.blocked=true and delete all their recordings + sources (admin/DMCA)",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Follower documentId",
                },
              ],
              responses: {
                "200": {
                  description: "Blocked and purged",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                          deletedSources: { type: "integer" },
                          deletedRecordings: { type: "integer" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Invalid documentId" },
                "404": { description: "Follower not found" },
              },
            },
          };

          // Endpoint: POST /followers/{documentId}/view
          draft.paths["/followers/{documentId}/view"] = {
            post: {
              tags: ["Follower"],
              operationId: "incrementFollowerView",
              summary: "Increment the public view counter for a follower",
              parameters: [
                {
                  name: "documentId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                  description: "Follower documentId",
                },
              ],
              responses: {
                "200": {
                  description: "Counter incremented",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          success: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                "400": { description: "Invalid documentId" },
              },
            },
          };

          draft.paths["/followers/unpause-my-followers"] = {
            post: {
              tags: ["Follower"],
              operationId: "unpauseMyFollowers",
              summary: "Unpause all followers for the current user",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          updated: { type: "integer" },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          if (draft.paths["/users/me"]?.get) {
            const populateParam = {
              name: "populate",
              in: "query",
              required: false,
              schema: {
                oneOf: [
                  { type: "string" },
                  { type: "array", items: { type: "string" } },
                  { type: "object" },
                ],
              },
              description: "Relations to populate",
            };

            draft.paths["/users/me"].get.parameters = [
              ...(draft.paths["/users/me"].get.parameters || []),
              populateParam,
            ];

            // Get the current response schema
            const currentSchema =
              draft.paths["/users/me"].get.responses["200"].content[
                "application/json"
              ].schema;

            // Extend it with role and subscription fields
            draft.paths["/users/me"].get.responses["200"].content[
              "application/json"
            ].schema = {
              allOf: [
                currentSchema,
                {
                  type: "object",
                  properties: {
                    role: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string" },
                      },
                    },
                    followers: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Follower" },
                    },
                    favorites: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Follower" },
                    },
                    socialAccounts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SocialAccount" },
                    },
                    subscriptionStatus: {
                      type: "string",
                      enum: ["active", "cancelled", "trialing", "expired"],
                      nullable: true,
                    },
                    billingPeriod: {
                      type: "string",
                      nullable: true,
                    },
                    subscriptionEndDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    freemius: {
                      type: "string",
                      nullable: true,
                      description:
                        "JSON string with Freemius subscription data",
                    },
                    mollie: {
                      type: "string",
                      nullable: true,
                      description: "JSON string with Mollie subscription data",
                    },
                    stripe: {
                      type: "string",
                      nullable: true,
                      description: "JSON string with Stripe subscription data",
                    },
                    paymentProvider: {
                      type: "string",
                      enum: ["freemius", "stripe", "mollie"],
                      nullable: true,
                    },
                    trialClaimed: {
                      type: "boolean",
                      default: false,
                    },
                  },
                },
              ],
            };

            draft.components.schemas.FilterOption = {
              type: "object",
              properties: {
                value: { type: "string" },
                count: { type: "string" },
              },
            };

            // Define FiltersResponse schema
            draft.components.schemas.FiltersResponse = {
              type: "object",
              properties: {
                countries: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterOption" },
                },
                countryCodes: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterOption" },
                },
                genders: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterOption" },
                },
                languages: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterOption" },
                },
                languageCodes: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterOption" },
                },
                types: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterOption" },
                },
              },
            };

            // Endpoint: GET /followers/filters
            draft.paths["/followers/filters"] = {
              get: {
                tags: ["Follower"],
                operationId: "getFollowerFilters",
                summary: "Get available filter options with counts",
                security: [{ bearerAuth: [] }],
                parameters: [
                  {
                    name: "type",
                    in: "query",
                    required: false,
                    schema: { $ref: "#/components/schemas/FollowerTypeEnum" },
                    description: "Filter all results by follower type",
                  },
                ],
                responses: {
                  "200": {
                    description: "OK",
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/FiltersResponse",
                        },
                      },
                    },
                  },
                  "401": { description: "Unauthorized" },
                },
              },
            };
          }
        },
      },
    },
  },
});
