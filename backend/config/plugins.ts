export default () => ({
  documentation: {
    enabled: true,
    config: {
      "x-strapi-config": {
        mutateDocumentation: (draft) => {
          // Fix populate parameter type for all GET endpoints to allow string, array, or object
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

          // Endpoint: /api/followers/for-user
          draft.paths["/followers/for-user"] = {
            get: {
              tags: ["Follower"],
              summary: "Get followers with recordings for logged in user",
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
                              $ref: "#/components/schemas/FollowerWithRecordings",
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

          // Endpoint: /api/recordings/for-user
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
        },
      },
    },
  },
});
