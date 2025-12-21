import type { Schema, Struct } from '@strapi/strapi';

export interface NavigationsLinks extends Struct.ComponentSchema {
  collectionName: 'components_navigations_links';
  info: {
    displayName: 'links';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      [
        'IconFlower',
        'IconUsers',
        'IconPlayerPlayFilled',
        'IconWorldSearch',
        'IconQuestionMark',
      ]
    >;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface VideosVideo extends Struct.ComponentSchema {
  collectionName: 'components_videos_videos';
  info: {
    displayName: 'video';
  };
  attributes: {
    height: Schema.Attribute.Integer;
    playlist: Schema.Attribute.Text;
    size: Schema.Attribute.String;
    sizeBytes: Schema.Attribute.Integer;
    width: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'navigations.links': NavigationsLinks;
      'videos.video': VideosVideo;
    }
  }
}
