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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'okay.links': OkayLinks;
    }
  }
}
