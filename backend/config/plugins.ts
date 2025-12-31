export default ({ env }) => ({
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
          region: "eu-central-1",
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
                    }
                  );
                }
              });
            }
          });

          // Add populate to /XXX/{id}
          const populateParam = draft.paths["/recordings"].get.parameters.find(
            (param: any) => param.name === "populate"
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

          // Extend Follower with isFollowing and totalRecordings
          draft.components.schemas.FollowerWithMeta = {
            allOf: [
              {
                type: "object",
                properties: {
                  isFollowing: { type: "boolean" },
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
                ],
                responses: {
                  ...draft.paths["/recordings"].get.responses,
                  "401": { description: "Unauthorized" },
                },
              },
            };
          }

          // Extract the inner data schema from FollowerRequest
          // First, extract the type enum from Follower and make it reusable
          if (draft.components.schemas.Follower?.properties?.type) {
            draft.components.schemas.FollowerTypeEnum =
              draft.components.schemas.Follower.properties.type;

            // Update Follower to use the ref
            draft.components.schemas.Follower.properties.type = {
              $ref: "#/components/schemas/FollowerTypeEnum",
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

            // Extend it with role (inline the role properties since $ref isn't resolving)
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
