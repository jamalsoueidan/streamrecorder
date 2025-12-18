import type { Core } from "@strapi/strapi";

declare global {
  var strapi: Core.Strapi;
}

export {};
