import type { Schema, Struct } from '@strapi/strapi';

export interface VideosVideo extends Struct.ComponentSchema {
  collectionName: 'components_videos_videos';
  info: {
    displayName: 'video';
  };
  attributes: {
    height: Schema.Attribute.Integer;
    sizeBytes: Schema.Attribute.BigInteger;
    width: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'videos.video': VideosVideo;
    }
  }
}
