import type { Schema, Struct } from '@strapi/strapi';

export interface OkayLinks extends Struct.ComponentSchema {
  collectionName: 'components_okay_links';
  info: {
    displayName: 'links';
    icon: 'apps';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['test', 'test1']> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface Videos480 extends Struct.ComponentSchema {
  collectionName: 'components_videos_480s';
  info: {
    displayName: 'data';
    icon: 'earth';
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
      'okay.links': OkayLinks;
      'videos.480': Videos480;
    }
  }
}
