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

          // Add scope param to /followers
          if (draft.paths["/followers"]?.get) {
            draft.paths["/followers"].get.parameters = [
              ...(draft.paths["/followers"].get.parameters || []),
              scopeParam,
            ];
          }

          // Add scope param to /recordings
          if (draft.paths["/recordings"]?.get) {
            draft.paths["/recordings"].get.parameters = [
              ...(draft.paths["/recordings"].get.parameters || []),
              scopeParam,
            ];
          }

          // Extend Follower with isFollowing and totalRecordings
          draft.components.schemas.FollowerWithMeta = {
            allOf: [
              { $ref: "#/components/schemas/Follower" },
              {
                type: "object",
                properties: {
                  isFollowing: { type: "boolean" },
                  totalRecordings: { type: "integer" },
                },
              },
            ],
          };

          // Update /followers response to use FollowerWithMeta
          if (draft.paths["/followers"]?.get?.responses?.["200"]) {
            draft.paths["/followers"].get.responses["200"] = {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/FollowerWithMeta",
                        },
                      },
                      meta: {
                        $ref: "#/components/schemas/FollowerListResponse/properties/meta",
                      },
                    },
                  },
                },
              },
            };
          }

          // Fix Recording.sources schema
          if (draft.components.schemas.Recording?.properties) {
            // Delete the broken ones
            delete draft.components.schemas.Recording.properties.sources;
            // Add them back with proper refs
            draft.components.schemas.Recording.properties.sources = {
              type: "array",
              items: { $ref: "#/components/schemas/Source" },
            };
          }

          // Extract the inner data schema from FollowerRequest
          if (draft.components.schemas.FollowerRequest?.properties?.data) {
            draft.components.schemas.FollowRequestBody =
              draft.components.schemas.FollowerRequest.properties.data;
          }

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
