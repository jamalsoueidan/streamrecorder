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

          draft.components.schemas.FollowerWithCount = {
            allOf: [
              { $ref: "#/components/schemas/Follower" },
              {
                type: "object",
                properties: {
                  totalRecordings: { type: "integer" },
                },
              },
            ],
          };

          draft.paths["/followers/for-user"] = {
            get: {
              tags: ["Follower"],
              summary: "Get followers for logged in user",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "page",
                  in: "query",
                  schema: { type: "integer", default: 1 },
                },
                {
                  name: "pageSize",
                  in: "query",
                  schema: { type: "integer", default: 20 },
                },
              ],
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
                              $ref: "#/components/schemas/FollowerWithCount",
                            },
                          },
                          meta: {
                            $ref: "#/components/schemas/FollowerListResponse/properties/meta",
                          },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          // /followers/not-following - use FollowerWithCount
          draft.paths["/followers/not-following"] = {
            get: {
              tags: ["Follower"],
              summary: "Get followers user is not following",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "page",
                  in: "query",
                  schema: { type: "integer", default: 1 },
                },
                {
                  name: "pageSize",
                  in: "query",
                  schema: { type: "integer", default: 20 },
                },
              ],
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
                              $ref: "#/components/schemas/FollowerWithCount",
                            },
                          },
                          meta: {
                            $ref: "#/components/schemas/FollowerListResponse/properties/meta",
                          },
                        },
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          // Extend Recording with full Source
          draft.components.schemas.RecordingWithSources = {
            type: "object",
            properties: {
              id: { type: "integer" },
              documentId: { type: "string" },
              follower: { $ref: "#/components/schemas/Follower" },
              sources: {
                type: "array",
                items: { $ref: "#/components/schemas/Source" },
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              publishedAt: { type: "string", format: "date-time" },
            },
          };

          draft.components.schemas.RecordingWithSourcesListResponse = {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/RecordingWithSources" },
              },
              meta: {
                $ref: "#/components/schemas/RecordingListResponse/properties/meta",
              },
            },
          };

          // /recordings/for-user - use RecordingWithSourcesListResponse
          draft.paths["/recordings/for-user"] = {
            get: {
              tags: ["Recording"],
              summary: "Get recordings from followed accounts",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "page",
                  in: "query",
                  schema: { type: "integer", default: 1 },
                },
                {
                  name: "pageSize",
                  in: "query",
                  schema: { type: "integer", default: 20 },
                },
              ],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/RecordingWithSourcesListResponse",
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
            },
          };

          // /recordings/not-following - use RecordingWithSourcesListResponse
          draft.paths["/recordings/not-following"] = {
            get: {
              tags: ["Recording"],
              summary: "Get recordings from accounts user is not following",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "page",
                  in: "query",
                  schema: { type: "integer", default: 1 },
                },
                {
                  name: "pageSize",
                  in: "query",
                  schema: { type: "integer", default: 20 },
                },
              ],
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/RecordingWithSourcesListResponse",
                      },
                    },
                  },
                },
                "401": { description: "Unauthorized" },
              },
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
                      $ref: "#/components/schemas/FollowerRequest",
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
          draft.paths["/followers/unfollow/{id}"] = {
            delete: {
              tags: ["Follower"],
              summary: "Unfollow an account",
              security: [{ bearerAuth: [] }],
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: { type: "integer" },
                },
              ],
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
        },
      },
    },
  },
});
