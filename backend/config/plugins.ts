export default () => ({
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

          // Custom schema: Follow request body
          draft.components.schemas.FollowRequest = {
            type: "object",
            required: ["username", "type"],
            properties: {
              username: { type: "string" },
              slug: { type: "string" },
              type: {
                type: "string",
                enum: ["tiktok", "instagram", "youtube"],
              },
            },
          };

          // Custom schema: Success response
          draft.components.schemas.SuccessResponse = {
            type: "object",
            properties: {
              success: { type: "boolean" },
            },
          };

          draft.components.schemas.PaginationMeta = {
            type: "object",
            properties: {
              pagination: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  pageSize: { type: "integer" },
                  pageCount: { type: "integer" },
                  total: { type: "integer" },
                },
              },
            },
          };

          // Custom schema: Follower with recordings
          draft.components.schemas.FollowerWithRecordings = {
            allOf: [
              { $ref: "#/components/schemas/Follower" },
              {
                type: "object",
                properties: {
                  totalRecordings: { type: "integer" },
                  recordings: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Recording" },
                  },
                },
              },
            ],
          };

          // Response schema for paginated followers
          draft.components.schemas.FollowersWithRecordingsResponse = {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/FollowerWithRecordings",
                },
              },
              meta: {
                $ref: "#/components/schemas/PaginationMeta",
              },
            },
          };

          // Endpoint: GET /followers/for-user
          draft.paths["/followers/for-user"] = {
            get: {
              tags: ["Follower"],
              summary: "Get followers with recordings for logged in user",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "page",
                  in: "query",
                  schema: { type: "integer", default: 1 },
                  description: "Page number",
                },
                {
                  name: "pageSize",
                  in: "query",
                  schema: { type: "integer", default: 20 },
                  description: "Number of items per page",
                },
              ],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/FollowersWithRecordingsResponse",
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          };

          // Endpoint: GET /followers/not-following
          draft.paths["/followers/not-following"] = {
            get: {
              tags: ["Follower"],
              summary: "Get followers that the user is not following",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "page",
                  in: "query",
                  schema: { type: "integer", default: 1 },
                  description: "Page number",
                },
                {
                  name: "pageSize",
                  in: "query",
                  schema: { type: "integer", default: 20 },
                  description: "Number of items per page",
                },
              ],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/FollowersWithRecordingsResponse",
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          };

          // Custom schema: Recording with sources
          draft.components.schemas.RecordingWithSources = {
            allOf: [
              { $ref: "#/components/schemas/Recording" },
              {
                type: "object",
                properties: {
                  sources: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Source" },
                  },
                },
              },
            ],
          };

          // Endpoint: GET /recordings/for-user
          draft.paths["/recordings/for-user"] = {
            get: {
              tags: ["Recording"],
              summary: "Get recordings from user's followed accounts",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/RecordingWithSources",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          };

          // Endpoint: POST /followers/follow
          draft.paths["/followers/follow"] = {
            post: {
              tags: ["Follower"],
              summary: "Follow a new account",
              description:
                "Creates follower if it doesn't exist and connects to current user",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FollowRequest",
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
                          data: {
                            $ref: "#/components/schemas/Follower",
                          },
                        },
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          };

          // Endpoint: DELETE /followers/unfollow/:id
          draft.paths["/followers/unfollow/{id}"] = {
            delete: {
              tags: ["Follower"],
              summary: "Unfollow an account",
              description:
                "Removes relation between user and follower (does not delete follower)",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: {
                    type: "integer",
                  },
                  description: "Follower ID to unfollow",
                },
              ],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/SuccessResponse",
                      },
                    },
                  },
                },
                "401": {
                  description: "Unauthorized",
                },
              },
            },
          };
        },
      },
    },
  },
});
