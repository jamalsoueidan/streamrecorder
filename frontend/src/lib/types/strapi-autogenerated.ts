/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum FollowerTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

/** Filter by follow status */
export enum ScopeEnum {
  Following = "following",
  Discover = "discover",
}

export interface Error {
  data?: object | object[] | null;
  error: {
    status?: number;
    name?: string;
    message?: string;
    details?: object;
  };
}

export interface AiRequestRequest {
  data: {
    /** @example "string or id" */
    recording?: number | string;
    generateClips?: boolean;
    generateMemes?: boolean;
    generateProfile?: boolean;
    state?: AiRequestRequestStateEnum;
    ai_tasks?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface AiRequestListResponse {
  data?: AiRequest[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface AiRequest {
  id?: string | number;
  documentId?: string;
  recording?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    description?: string;
    follower?: {
      id?: string | number;
      documentId?: string;
      nickname?: string;
      username?: string;
      type?: AiRequestTypeEnum;
      gender?: AiRequestGenderEnum;
      countryCode?: string;
      languageCode?: string;
      avatar?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        formats?: any;
        hash?: string;
        ext?: string;
        mime?: string;
        /** @format float */
        size?: number;
        url?: string;
        previewUrl?: string;
        provider?: string;
        provider_metadata?: any;
        related?: {
          id?: string | number;
          documentId?: string;
        }[];
        folder?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          pathId?: number;
          parent?: {
            id?: string | number;
            documentId?: string;
          };
          children?: {
            id?: string | number;
            documentId?: string;
          }[];
          files?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            alternativeText?: string;
            caption?: string;
            width?: number;
            height?: number;
            formats?: any;
            hash?: string;
            ext?: string;
            mime?: string;
            /** @format float */
            size?: number;
            url?: string;
            previewUrl?: string;
            provider?: string;
            provider_metadata?: any;
            related?: {
              id?: string | number;
              documentId?: string;
            }[];
            folder?: {
              id?: string | number;
              documentId?: string;
            };
            folderPath?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
              firstname?: string;
              lastname?: string;
              username?: string;
              /** @format email */
              email?: string;
              resetPasswordToken?: string;
              registrationToken?: string;
              isActive?: boolean;
              roles?: {
                id?: string | number;
                documentId?: string;
                name?: string;
                code?: string;
                description?: string;
                users?: {
                  id?: string | number;
                  documentId?: string;
                }[];
                permissions?: {
                  id?: string | number;
                  documentId?: string;
                  action?: string;
                  actionParameters?: any;
                  subject?: string;
                  properties?: any;
                  conditions?: any;
                  role?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  /** @format date-time */
                  createdAt?: string;
                  /** @format date-time */
                  updatedAt?: string;
                  /** @format date-time */
                  publishedAt?: string;
                  createdBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  updatedBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  locale?: string;
                  localizations?: {
                    id?: string | number;
                    documentId?: string;
                  }[];
                }[];
                /** @format date-time */
                createdAt?: string;
                /** @format date-time */
                updatedAt?: string;
                /** @format date-time */
                publishedAt?: string;
                createdBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                updatedBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                locale?: string;
                localizations?: {
                  id?: string | number;
                  documentId?: string;
                }[];
              }[];
              blocked?: boolean;
              preferedLanguage?: string;
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          }[];
          path?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        folderPath?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      /** @format date-time */
      lastCheckedAt?: string;
      protected?: boolean;
      pause?: boolean;
      description?: string;
      tagline?: string;
      faq?: any;
      category?: string;
      migration?: number;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    sources?: {
      id?: string | number;
      documentId?: string;
      state?: AiRequestStateEnum;
      executionId?: number;
      /** @format date-time */
      finishedAt?: string;
      path?: string;
      /** @format float */
      duration?: number;
      thumbnailInterval?: number;
      thumbnailCols?: number;
      videoOriginal?: VideosVideoComponent;
      videoSmall?: VideosVideoComponent;
      recording?: {
        id?: string | number;
        documentId?: string;
      };
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  generateClips?: boolean;
  generateMemes?: boolean;
  generateProfile?: boolean;
  state?: AiRequestStateEnum1;
  ai_tasks?: {
    id?: string | number;
    documentId?: string;
    ai_request?: {
      id?: string | number;
      documentId?: string;
      recording?: {
        id?: string | number;
        documentId?: string;
      };
      generateClips?: boolean;
      generateMemes?: boolean;
      generateProfile?: boolean;
      state?: AiRequestStateEnum2;
      ai_tasks?: {
        id?: string | number;
        documentId?: string;
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    type?: string;
    state?: AiRequestStateEnum3;
    output?: any;
    executionId?: number;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
  }[];
}

export interface AiRequestResponse {
  data?: AiRequest;
  meta?: object;
}

export interface VideosVideoComponent {
  id?: string | number;
  width?: number;
  height?: number;
  /**
   * @pattern ^\d*$
   * @example "123456789"
   */
  sizeBytes?: string;
}

export interface AiTaskRequest {
  data: {
    /** @example "string or id" */
    ai_request?: number | string;
    type?: string;
    state?: AiTaskRequestStateEnum;
    output?: any;
    executionId?: number;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface AiTaskListResponse {
  data?: AiTask[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface AiTask {
  id?: string | number;
  documentId?: string;
  ai_request?: {
    id?: string | number;
    documentId?: string;
    recording?: {
      id?: string | number;
      documentId?: string;
      title?: string;
      description?: string;
      follower?: {
        id?: string | number;
        documentId?: string;
        nickname?: string;
        username?: string;
        type?: AiTaskTypeEnum;
        gender?: AiTaskGenderEnum;
        countryCode?: string;
        languageCode?: string;
        avatar?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          alternativeText?: string;
          caption?: string;
          width?: number;
          height?: number;
          formats?: any;
          hash?: string;
          ext?: string;
          mime?: string;
          /** @format float */
          size?: number;
          url?: string;
          previewUrl?: string;
          provider?: string;
          provider_metadata?: any;
          related?: {
            id?: string | number;
            documentId?: string;
          }[];
          folder?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            pathId?: number;
            parent?: {
              id?: string | number;
              documentId?: string;
            };
            children?: {
              id?: string | number;
              documentId?: string;
            }[];
            files?: {
              id?: string | number;
              documentId?: string;
              name?: string;
              alternativeText?: string;
              caption?: string;
              width?: number;
              height?: number;
              formats?: any;
              hash?: string;
              ext?: string;
              mime?: string;
              /** @format float */
              size?: number;
              url?: string;
              previewUrl?: string;
              provider?: string;
              provider_metadata?: any;
              related?: {
                id?: string | number;
                documentId?: string;
              }[];
              folder?: {
                id?: string | number;
                documentId?: string;
              };
              folderPath?: string;
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
                firstname?: string;
                lastname?: string;
                username?: string;
                /** @format email */
                email?: string;
                resetPasswordToken?: string;
                registrationToken?: string;
                isActive?: boolean;
                roles?: {
                  id?: string | number;
                  documentId?: string;
                  name?: string;
                  code?: string;
                  description?: string;
                  users?: {
                    id?: string | number;
                    documentId?: string;
                  }[];
                  permissions?: {
                    id?: string | number;
                    documentId?: string;
                    action?: string;
                    actionParameters?: any;
                    subject?: string;
                    properties?: any;
                    conditions?: any;
                    role?: {
                      id?: string | number;
                      documentId?: string;
                    };
                    /** @format date-time */
                    createdAt?: string;
                    /** @format date-time */
                    updatedAt?: string;
                    /** @format date-time */
                    publishedAt?: string;
                    createdBy?: {
                      id?: string | number;
                      documentId?: string;
                    };
                    updatedBy?: {
                      id?: string | number;
                      documentId?: string;
                    };
                    locale?: string;
                    localizations?: {
                      id?: string | number;
                      documentId?: string;
                    }[];
                  }[];
                  /** @format date-time */
                  createdAt?: string;
                  /** @format date-time */
                  updatedAt?: string;
                  /** @format date-time */
                  publishedAt?: string;
                  createdBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  updatedBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  locale?: string;
                  localizations?: {
                    id?: string | number;
                    documentId?: string;
                  }[];
                }[];
                blocked?: boolean;
                preferedLanguage?: string;
                /** @format date-time */
                createdAt?: string;
                /** @format date-time */
                updatedAt?: string;
                /** @format date-time */
                publishedAt?: string;
                createdBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                updatedBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                locale?: string;
                localizations?: {
                  id?: string | number;
                  documentId?: string;
                }[];
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            }[];
            path?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          };
          folderPath?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        /** @format date-time */
        lastCheckedAt?: string;
        protected?: boolean;
        pause?: boolean;
        description?: string;
        tagline?: string;
        faq?: any;
        category?: string;
        migration?: number;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      sources?: {
        id?: string | number;
        documentId?: string;
        state?: AiTaskStateEnum;
        executionId?: number;
        /** @format date-time */
        finishedAt?: string;
        path?: string;
        /** @format float */
        duration?: number;
        thumbnailInterval?: number;
        thumbnailCols?: number;
        videoOriginal?: VideosVideoComponent;
        videoSmall?: VideosVideoComponent;
        recording?: {
          id?: string | number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    generateClips?: boolean;
    generateMemes?: boolean;
    generateProfile?: boolean;
    state?: AiTaskStateEnum1;
    ai_tasks?: {
      id?: string | number;
      documentId?: string;
      ai_request?: {
        id?: string | number;
        documentId?: string;
      };
      type?: string;
      state?: AiTaskStateEnum2;
      output?: any;
      executionId?: number;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  type?: string;
  state?: AiTaskStateEnum3;
  output?: any;
  executionId?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
  }[];
}

export interface AiTaskResponse {
  data?: AiTask;
  meta?: object;
}

export interface ArticleRequest {
  data: {
    title: string;
    content: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ArticleListResponse {
  data?: Article[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Article {
  id?: string | number;
  documentId?: string;
  title: string;
  content: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    /** @format email */
    email?: string;
    resetPasswordToken?: string;
    registrationToken?: string;
    isActive?: boolean;
    roles?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      code?: string;
      description?: string;
      users?: {
        id?: string | number;
        documentId?: string;
      }[];
      permissions?: {
        id?: string | number;
        documentId?: string;
        action?: string;
        actionParameters?: any;
        subject?: string;
        properties?: any;
        conditions?: any;
        role?: {
          id?: string | number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    blocked?: boolean;
    preferedLanguage?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    content?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
}

export interface ArticleResponse {
  data?: Article;
  meta?: object;
}

export interface ChangeLogRequest {
  data: {
    version?: string;
    body?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ChangeLogListResponse {
  data?: ChangeLog[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface ChangeLog {
  id?: string | number;
  documentId?: string;
  version?: string;
  body?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    /** @format email */
    email?: string;
    resetPasswordToken?: string;
    registrationToken?: string;
    isActive?: boolean;
    roles?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      code?: string;
      description?: string;
      users?: {
        id?: string | number;
        documentId?: string;
      }[];
      permissions?: {
        id?: string | number;
        documentId?: string;
        action?: string;
        actionParameters?: any;
        subject?: string;
        properties?: any;
        conditions?: any;
        role?: {
          id?: string | number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    blocked?: boolean;
    preferedLanguage?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
    version?: string;
    body?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
}

export interface ChangeLogResponse {
  data?: ChangeLog;
  meta?: object;
}

export interface ClipRequest {
  data: {
    title?: string;
    description?: string;
    hook_text?: string;
    transcript?: any;
    tags?: string;
    viral_score?: number;
    thumbnail_timestamp?: string;
    duration?: number;
    end?: string;
    start?: string;
    path?: string;
    /** @example "string or id" */
    follower?: number | string;
    /** @example "string or id" */
    recording?: number | string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ClipListResponse {
  data?: Clip[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Clip {
  id?: string | number;
  documentId?: string;
  title?: string;
  description?: string;
  hook_text?: string;
  transcript?: any;
  tags?: string;
  viral_score?: number;
  thumbnail_timestamp?: string;
  duration?: number;
  end?: string;
  start?: string;
  path?: string;
  follower?: {
    id?: string | number;
    documentId?: string;
    nickname?: string;
    username?: string;
    type?: ClipTypeEnum;
    gender?: ClipGenderEnum;
    countryCode?: string;
    languageCode?: string;
    avatar?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
      formats?: any;
      hash?: string;
      ext?: string;
      mime?: string;
      /** @format float */
      size?: number;
      url?: string;
      previewUrl?: string;
      provider?: string;
      provider_metadata?: any;
      related?: {
        id?: string | number;
        documentId?: string;
      }[];
      folder?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        pathId?: number;
        parent?: {
          id?: string | number;
          documentId?: string;
        };
        children?: {
          id?: string | number;
          documentId?: string;
        }[];
        files?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          alternativeText?: string;
          caption?: string;
          width?: number;
          height?: number;
          formats?: any;
          hash?: string;
          ext?: string;
          mime?: string;
          /** @format float */
          size?: number;
          url?: string;
          previewUrl?: string;
          provider?: string;
          provider_metadata?: any;
          related?: {
            id?: string | number;
            documentId?: string;
          }[];
          folder?: {
            id?: string | number;
            documentId?: string;
          };
          folderPath?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
            firstname?: string;
            lastname?: string;
            username?: string;
            /** @format email */
            email?: string;
            resetPasswordToken?: string;
            registrationToken?: string;
            isActive?: boolean;
            roles?: {
              id?: string | number;
              documentId?: string;
              name?: string;
              code?: string;
              description?: string;
              users?: {
                id?: string | number;
                documentId?: string;
              }[];
              permissions?: {
                id?: string | number;
                documentId?: string;
                action?: string;
                actionParameters?: any;
                subject?: string;
                properties?: any;
                conditions?: any;
                role?: {
                  id?: string | number;
                  documentId?: string;
                };
                /** @format date-time */
                createdAt?: string;
                /** @format date-time */
                updatedAt?: string;
                /** @format date-time */
                publishedAt?: string;
                createdBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                updatedBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                locale?: string;
                localizations?: {
                  id?: string | number;
                  documentId?: string;
                }[];
              }[];
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            }[];
            blocked?: boolean;
            preferedLanguage?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        }[];
        path?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      folderPath?: string;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    /** @format date-time */
    lastCheckedAt?: string;
    protected?: boolean;
    pause?: boolean;
    description?: string;
    tagline?: string;
    faq?: any;
    category?: string;
    migration?: number;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  recording?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    description?: string;
    follower?: {
      id?: string | number;
      documentId?: string;
    };
    sources?: {
      id?: string | number;
      documentId?: string;
      state?: ClipStateEnum;
      executionId?: number;
      /** @format date-time */
      finishedAt?: string;
      path?: string;
      /** @format float */
      duration?: number;
      thumbnailInterval?: number;
      thumbnailCols?: number;
      videoOriginal?: VideosVideoComponent;
      videoSmall?: VideosVideoComponent;
      recording?: {
        id?: string | number;
        documentId?: string;
      };
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    description?: string;
    hook_text?: string;
    transcript?: any;
    tags?: string;
    viral_score?: number;
    thumbnail_timestamp?: string;
    duration?: number;
    end?: string;
    start?: string;
    path?: string;
    follower?: {
      id?: string | number;
      documentId?: string;
    };
    recording?: {
      id?: string | number;
      documentId?: string;
    };
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
}

export interface ClipResponse {
  data?: Clip;
  meta?: object;
}

export interface EmailTemplateRequest {
  data: {
    subjectMatcher: string;
    subject: string;
    text?: string;
    html?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface EmailTemplateListResponse {
  data?: EmailTemplate[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface EmailTemplate {
  id?: string | number;
  documentId?: string;
  subjectMatcher: string;
  subject: string;
  text?: string;
  html?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    /** @format email */
    email?: string;
    resetPasswordToken?: string;
    registrationToken?: string;
    isActive?: boolean;
    roles?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      code?: string;
      description?: string;
      users?: {
        id?: string | number;
        documentId?: string;
      }[];
      permissions?: {
        id?: string | number;
        documentId?: string;
        action?: string;
        actionParameters?: any;
        subject?: string;
        properties?: any;
        conditions?: any;
        role?: {
          id?: string | number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    blocked?: boolean;
    preferedLanguage?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
    subjectMatcher?: string;
    subject?: string;
    text?: string;
    html?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
}

export interface EmailTemplateResponse {
  data?: EmailTemplate;
  meta?: object;
}

export interface FollowerRequest {
  data: {
    nickname?: string;
    username: string;
    type: FollowerRequestTypeEnum;
    gender?: FollowerRequestGenderEnum;
    countryCode?: string;
    languageCode?: string;
    /** @example "string or id" */
    avatar?: number | string;
    /** @format date-time */
    lastCheckedAt?: string;
    protected?: boolean;
    pause?: boolean;
    description?: string;
    tagline?: string;
    faq?: any;
    category?: string;
    migration?: number;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface FollowerListResponse {
  data?: Follower[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Follower {
  id?: string | number;
  documentId?: string;
  nickname?: string;
  username: string;
  type: FollowerTypeEnum;
  gender?: FollowerGenderEnum;
  countryCode?: string;
  languageCode?: string;
  avatar?: {
    id?: string | number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: any;
    hash?: string;
    ext?: string;
    mime?: string;
    /** @format float */
    size?: number;
    url?: string;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: any;
    related?: {
      id?: string | number;
      documentId?: string;
    }[];
    folder?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      pathId?: number;
      parent?: {
        id?: string | number;
        documentId?: string;
      };
      children?: {
        id?: string | number;
        documentId?: string;
      }[];
      files?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        formats?: any;
        hash?: string;
        ext?: string;
        mime?: string;
        /** @format float */
        size?: number;
        url?: string;
        previewUrl?: string;
        provider?: string;
        provider_metadata?: any;
        related?: {
          id?: string | number;
          documentId?: string;
        }[];
        folder?: {
          id?: string | number;
          documentId?: string;
        };
        folderPath?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
          firstname?: string;
          lastname?: string;
          username?: string;
          /** @format email */
          email?: string;
          resetPasswordToken?: string;
          registrationToken?: string;
          isActive?: boolean;
          roles?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            code?: string;
            description?: string;
            users?: {
              id?: string | number;
              documentId?: string;
            }[];
            permissions?: {
              id?: string | number;
              documentId?: string;
              action?: string;
              actionParameters?: any;
              subject?: string;
              properties?: any;
              conditions?: any;
              role?: {
                id?: string | number;
                documentId?: string;
              };
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            }[];
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          }[];
          blocked?: boolean;
          preferedLanguage?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      }[];
      path?: string;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    folderPath?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  /** @format date-time */
  lastCheckedAt?: string;
  protected?: boolean;
  pause?: boolean;
  description?: string;
  tagline?: string;
  faq?: any;
  category?: string;
  migration?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
    nickname?: string;
    username?: string;
    type?: FollowerTypeEnum;
    gender?: FollowerGenderEnum1;
    countryCode?: string;
    languageCode?: string;
    avatar?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
      formats?: any;
      hash?: string;
      ext?: string;
      mime?: string;
      /** @format float */
      size?: number;
      url?: string;
      previewUrl?: string;
      provider?: string;
      provider_metadata?: any;
      related?: {
        id?: string | number;
        documentId?: string;
      }[];
      folder?: {
        id?: string | number;
        documentId?: string;
      };
      folderPath?: string;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    /** @format date-time */
    lastCheckedAt?: string;
    protected?: boolean;
    pause?: boolean;
    description?: string;
    tagline?: string;
    faq?: any;
    category?: string;
    migration?: number;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
}

export interface FollowerResponse {
  data?: Follower;
  meta?: object;
}

export interface MemeRequest {
  data: {
    title?: string;
    transcript?: string;
    tags?: string;
    type?: MemeRequestTypeEnum;
    start?: string;
    duration?: number;
    end?: string;
    viral_score?: number;
    /** @example "string or id" */
    recording?: number | string;
    /** @example "string or id" */
    follower?: number | string;
    path?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface MemeListResponse {
  data?: Meme[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Meme {
  id?: string | number;
  documentId?: string;
  title?: string;
  transcript?: string;
  tags?: string;
  type?: MemeTypeEnum;
  start?: string;
  duration?: number;
  end?: string;
  viral_score?: number;
  recording?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    description?: string;
    follower?: {
      id?: string | number;
      documentId?: string;
      nickname?: string;
      username?: string;
      type?: MemeTypeEnum1;
      gender?: MemeGenderEnum;
      countryCode?: string;
      languageCode?: string;
      avatar?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        formats?: any;
        hash?: string;
        ext?: string;
        mime?: string;
        /** @format float */
        size?: number;
        url?: string;
        previewUrl?: string;
        provider?: string;
        provider_metadata?: any;
        related?: {
          id?: string | number;
          documentId?: string;
        }[];
        folder?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          pathId?: number;
          parent?: {
            id?: string | number;
            documentId?: string;
          };
          children?: {
            id?: string | number;
            documentId?: string;
          }[];
          files?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            alternativeText?: string;
            caption?: string;
            width?: number;
            height?: number;
            formats?: any;
            hash?: string;
            ext?: string;
            mime?: string;
            /** @format float */
            size?: number;
            url?: string;
            previewUrl?: string;
            provider?: string;
            provider_metadata?: any;
            related?: {
              id?: string | number;
              documentId?: string;
            }[];
            folder?: {
              id?: string | number;
              documentId?: string;
            };
            folderPath?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
              firstname?: string;
              lastname?: string;
              username?: string;
              /** @format email */
              email?: string;
              resetPasswordToken?: string;
              registrationToken?: string;
              isActive?: boolean;
              roles?: {
                id?: string | number;
                documentId?: string;
                name?: string;
                code?: string;
                description?: string;
                users?: {
                  id?: string | number;
                  documentId?: string;
                }[];
                permissions?: {
                  id?: string | number;
                  documentId?: string;
                  action?: string;
                  actionParameters?: any;
                  subject?: string;
                  properties?: any;
                  conditions?: any;
                  role?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  /** @format date-time */
                  createdAt?: string;
                  /** @format date-time */
                  updatedAt?: string;
                  /** @format date-time */
                  publishedAt?: string;
                  createdBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  updatedBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  locale?: string;
                  localizations?: {
                    id?: string | number;
                    documentId?: string;
                  }[];
                }[];
                /** @format date-time */
                createdAt?: string;
                /** @format date-time */
                updatedAt?: string;
                /** @format date-time */
                publishedAt?: string;
                createdBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                updatedBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                locale?: string;
                localizations?: {
                  id?: string | number;
                  documentId?: string;
                }[];
              }[];
              blocked?: boolean;
              preferedLanguage?: string;
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          }[];
          path?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        folderPath?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      /** @format date-time */
      lastCheckedAt?: string;
      protected?: boolean;
      pause?: boolean;
      description?: string;
      tagline?: string;
      faq?: any;
      category?: string;
      migration?: number;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    sources?: {
      id?: string | number;
      documentId?: string;
      state?: MemeStateEnum;
      executionId?: number;
      /** @format date-time */
      finishedAt?: string;
      path?: string;
      /** @format float */
      duration?: number;
      thumbnailInterval?: number;
      thumbnailCols?: number;
      videoOriginal?: VideosVideoComponent;
      videoSmall?: VideosVideoComponent;
      recording?: {
        id?: string | number;
        documentId?: string;
      };
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  follower?: {
    id?: string | number;
    documentId?: string;
  };
  path?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    transcript?: string;
    tags?: string;
    type?: MemeTypeEnum2;
    start?: string;
    duration?: number;
    end?: string;
    viral_score?: number;
    recording?: {
      id?: string | number;
      documentId?: string;
    };
    follower?: {
      id?: string | number;
      documentId?: string;
    };
    path?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  }[];
}

export interface MemeResponse {
  data?: Meme;
  meta?: object;
}

export interface MessageRequest {
  data: {
    type?: string;
    subject?: string;
    content?: string;
    /** @example "string or id" */
    user?: number | string;
    state?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface MessageListResponse {
  data?: Message[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Message {
  id?: string | number;
  documentId?: string;
  type?: string;
  subject?: string;
  content?: string;
  user?: {
    id?: string | number;
    documentId?: string;
    username?: string;
    /** @format email */
    email?: string;
    provider?: string;
    resetPasswordToken?: string;
    confirmationToken?: string;
    confirmed?: boolean;
    blocked?: boolean;
    role?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      description?: string;
      type?: string;
      permissions?: {
        id?: string | number;
        documentId?: string;
        action?: string;
        role?: {
          id?: string | number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
          firstname?: string;
          lastname?: string;
          username?: string;
          /** @format email */
          email?: string;
          resetPasswordToken?: string;
          registrationToken?: string;
          isActive?: boolean;
          roles?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            code?: string;
            description?: string;
            users?: {
              id?: string | number;
              documentId?: string;
            }[];
            permissions?: {
              id?: string | number;
              documentId?: string;
              action?: string;
              actionParameters?: any;
              subject?: string;
              properties?: any;
              conditions?: any;
              role?: {
                id?: string | number;
                documentId?: string;
              };
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            }[];
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          }[];
          blocked?: boolean;
          preferedLanguage?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      }[];
      users?: {
        id?: string | number;
        documentId?: string;
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    followers?: {
      id?: string | number;
      documentId?: string;
      nickname?: string;
      username?: string;
      type?: MessageTypeEnum;
      gender?: MessageGenderEnum;
      countryCode?: string;
      languageCode?: string;
      avatar?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        formats?: any;
        hash?: string;
        ext?: string;
        mime?: string;
        /** @format float */
        size?: number;
        url?: string;
        previewUrl?: string;
        provider?: string;
        provider_metadata?: any;
        related?: {
          id?: string | number;
          documentId?: string;
        }[];
        folder?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          pathId?: number;
          parent?: {
            id?: string | number;
            documentId?: string;
          };
          children?: {
            id?: string | number;
            documentId?: string;
          }[];
          files?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            alternativeText?: string;
            caption?: string;
            width?: number;
            height?: number;
            formats?: any;
            hash?: string;
            ext?: string;
            mime?: string;
            /** @format float */
            size?: number;
            url?: string;
            previewUrl?: string;
            provider?: string;
            provider_metadata?: any;
            related?: {
              id?: string | number;
              documentId?: string;
            }[];
            folder?: {
              id?: string | number;
              documentId?: string;
            };
            folderPath?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          }[];
          path?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        folderPath?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      /** @format date-time */
      lastCheckedAt?: string;
      protected?: boolean;
      pause?: boolean;
      description?: string;
      tagline?: string;
      faq?: any;
      category?: string;
      migration?: number;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    messages?: {
      id?: string | number;
      documentId?: string;
      type?: string;
      subject?: string;
      content?: string;
      user?: {
        id?: string | number;
        documentId?: string;
      };
      state?: string;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  state?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
  }[];
}

export interface MessageResponse {
  data?: Message;
  meta?: object;
}

export interface RecordingRequest {
  data: {
    title?: string;
    description?: string;
    /** @example "string or id" */
    follower?: number | string;
    sources?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface RecordingListResponse {
  data?: Recording[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Recording {
  id?: string | number;
  documentId?: string;
  title?: string;
  description?: string;
  follower?: {
    id?: string | number;
    documentId?: string;
    nickname?: string;
    username?: string;
    type?: FollowerTypeEnum;
    gender?: RecordingGenderEnum;
    countryCode?: string;
    languageCode?: string;
    avatar?: {
      id?: string | number;
      documentId?: string;
      name?: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
      formats?: any;
      hash?: string;
      ext?: string;
      mime?: string;
      /** @format float */
      size?: number;
      url?: string;
      previewUrl?: string;
      provider?: string;
      provider_metadata?: any;
      related?: {
        id?: string | number;
        documentId?: string;
      }[];
      folder?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        pathId?: number;
        parent?: {
          id?: string | number;
          documentId?: string;
        };
        children?: {
          id?: string | number;
          documentId?: string;
        }[];
        files?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          alternativeText?: string;
          caption?: string;
          width?: number;
          height?: number;
          formats?: any;
          hash?: string;
          ext?: string;
          mime?: string;
          /** @format float */
          size?: number;
          url?: string;
          previewUrl?: string;
          provider?: string;
          provider_metadata?: any;
          related?: {
            id?: string | number;
            documentId?: string;
          }[];
          folder?: {
            id?: string | number;
            documentId?: string;
          };
          folderPath?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
            firstname?: string;
            lastname?: string;
            username?: string;
            /** @format email */
            email?: string;
            resetPasswordToken?: string;
            registrationToken?: string;
            isActive?: boolean;
            roles?: {
              id?: string | number;
              documentId?: string;
              name?: string;
              code?: string;
              description?: string;
              users?: {
                id?: string | number;
                documentId?: string;
              }[];
              permissions?: {
                id?: string | number;
                documentId?: string;
                action?: string;
                actionParameters?: any;
                subject?: string;
                properties?: any;
                conditions?: any;
                role?: {
                  id?: string | number;
                  documentId?: string;
                };
                /** @format date-time */
                createdAt?: string;
                /** @format date-time */
                updatedAt?: string;
                /** @format date-time */
                publishedAt?: string;
                createdBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                updatedBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                locale?: string;
                localizations?: {
                  id?: string | number;
                  documentId?: string;
                }[];
              }[];
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            }[];
            blocked?: boolean;
            preferedLanguage?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        }[];
        path?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      folderPath?: string;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    /** @format date-time */
    lastCheckedAt?: string;
    protected?: boolean;
    pause?: boolean;
    description?: string;
    tagline?: string;
    faq?: any;
    category?: string;
    migration?: number;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
  }[];
  sources?: Source[];
}

export interface RecordingResponse {
  data?: Recording;
  meta?: object;
}

export interface SourceRequest {
  data: {
    state: SourceRequestStateEnum;
    executionId?: number;
    /** @format date-time */
    finishedAt?: string;
    path: string;
    /** @format float */
    duration: number;
    thumbnailInterval?: number;
    thumbnailCols?: number;
    videoOriginal?: VideosVideoComponent;
    videoSmall?: VideosVideoComponent;
    /** @example "string or id" */
    recording?: number | string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface SourceListResponse {
  data?: Source[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Source {
  id?: string | number;
  documentId?: string;
  state: SourceStateEnum;
  executionId?: number;
  /** @format date-time */
  finishedAt?: string;
  path: string;
  /** @format float */
  duration: number;
  thumbnailInterval?: number;
  thumbnailCols?: number;
  videoOriginal?: VideosVideoComponent;
  videoSmall?: VideosVideoComponent;
  recording?: {
    id?: string | number;
    documentId?: string;
    title?: string;
    description?: string;
    follower?: {
      id?: string | number;
      documentId?: string;
      nickname?: string;
      username?: string;
      type?: SourceTypeEnum;
      gender?: SourceGenderEnum;
      countryCode?: string;
      languageCode?: string;
      avatar?: {
        id?: string | number;
        documentId?: string;
        name?: string;
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        formats?: any;
        hash?: string;
        ext?: string;
        mime?: string;
        /** @format float */
        size?: number;
        url?: string;
        previewUrl?: string;
        provider?: string;
        provider_metadata?: any;
        related?: {
          id?: string | number;
          documentId?: string;
        }[];
        folder?: {
          id?: string | number;
          documentId?: string;
          name?: string;
          pathId?: number;
          parent?: {
            id?: string | number;
            documentId?: string;
          };
          children?: {
            id?: string | number;
            documentId?: string;
          }[];
          files?: {
            id?: string | number;
            documentId?: string;
            name?: string;
            alternativeText?: string;
            caption?: string;
            width?: number;
            height?: number;
            formats?: any;
            hash?: string;
            ext?: string;
            mime?: string;
            /** @format float */
            size?: number;
            url?: string;
            previewUrl?: string;
            provider?: string;
            provider_metadata?: any;
            related?: {
              id?: string | number;
              documentId?: string;
            }[];
            folder?: {
              id?: string | number;
              documentId?: string;
            };
            folderPath?: string;
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: string | number;
              documentId?: string;
              firstname?: string;
              lastname?: string;
              username?: string;
              /** @format email */
              email?: string;
              resetPasswordToken?: string;
              registrationToken?: string;
              isActive?: boolean;
              roles?: {
                id?: string | number;
                documentId?: string;
                name?: string;
                code?: string;
                description?: string;
                users?: {
                  id?: string | number;
                  documentId?: string;
                }[];
                permissions?: {
                  id?: string | number;
                  documentId?: string;
                  action?: string;
                  actionParameters?: any;
                  subject?: string;
                  properties?: any;
                  conditions?: any;
                  role?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  /** @format date-time */
                  createdAt?: string;
                  /** @format date-time */
                  updatedAt?: string;
                  /** @format date-time */
                  publishedAt?: string;
                  createdBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  updatedBy?: {
                    id?: string | number;
                    documentId?: string;
                  };
                  locale?: string;
                  localizations?: {
                    id?: string | number;
                    documentId?: string;
                  }[];
                }[];
                /** @format date-time */
                createdAt?: string;
                /** @format date-time */
                updatedAt?: string;
                /** @format date-time */
                publishedAt?: string;
                createdBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                updatedBy?: {
                  id?: string | number;
                  documentId?: string;
                };
                locale?: string;
                localizations?: {
                  id?: string | number;
                  documentId?: string;
                }[];
              }[];
              blocked?: boolean;
              preferedLanguage?: string;
              /** @format date-time */
              createdAt?: string;
              /** @format date-time */
              updatedAt?: string;
              /** @format date-time */
              publishedAt?: string;
              createdBy?: {
                id?: string | number;
                documentId?: string;
              };
              updatedBy?: {
                id?: string | number;
                documentId?: string;
              };
              locale?: string;
              localizations?: {
                id?: string | number;
                documentId?: string;
              }[];
            };
            updatedBy?: {
              id?: string | number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: string | number;
              documentId?: string;
            }[];
          }[];
          path?: string;
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: string | number;
            documentId?: string;
          };
          updatedBy?: {
            id?: string | number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: string | number;
            documentId?: string;
          }[];
        };
        folderPath?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: string | number;
          documentId?: string;
        };
        updatedBy?: {
          id?: string | number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: string | number;
          documentId?: string;
        }[];
      };
      /** @format date-time */
      lastCheckedAt?: string;
      protected?: boolean;
      pause?: boolean;
      description?: string;
      tagline?: string;
      faq?: any;
      category?: string;
      migration?: number;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    };
    sources?: {
      id?: string | number;
      documentId?: string;
      state?: SourceStateEnum1;
      executionId?: number;
      /** @format date-time */
      finishedAt?: string;
      path?: string;
      /** @format float */
      duration?: number;
      thumbnailInterval?: number;
      thumbnailCols?: number;
      videoOriginal?: VideosVideoComponent;
      videoSmall?: VideosVideoComponent;
      recording?: {
        id?: string | number;
        documentId?: string;
      };
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: string | number;
        documentId?: string;
      };
      updatedBy?: {
        id?: string | number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: string | number;
        documentId?: string;
      }[];
    }[];
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: string | number;
      documentId?: string;
    };
    updatedBy?: {
      id?: string | number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: string | number;
      documentId?: string;
    }[];
  };
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: string | number;
    documentId?: string;
  };
  updatedBy?: {
    id?: string | number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: string | number;
    documentId?: string;
  }[];
}

export interface SourceResponse {
  data?: Source;
  meta?: object;
}

export interface UploadFile {
  id?: number;
  name?: string;
  alternativeText?: string;
  caption?: string;
  /** @format integer */
  width?: number;
  /** @format integer */
  height?: number;
  formats?: number;
  hash?: string;
  ext?: string;
  mime?: string;
  /** @format double */
  size?: number;
  url?: string;
  previewUrl?: string;
  provider?: string;
  provider_metadata?: object;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UsersPermissionsRole {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UsersPermissionsUser {
  /** @example 1 */
  id?: number;
  /** @example "foo.bar" */
  username?: string;
  /** @example "foo.bar@strapi.io" */
  email?: string;
  /** @example "local" */
  provider?: string;
  /** @example true */
  confirmed?: boolean;
  /** @example false */
  blocked?: boolean;
  /**
   * @format date-time
   * @example "2022-06-02T08:32:06.258Z"
   */
  createdAt?: string;
  /**
   * @format date-time
   * @example "2022-06-02T08:32:06.267Z"
   */
  updatedAt?: string;
}

export interface UsersPermissionsUserRegistration {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" */
  jwt?: string;
  user?: UsersPermissionsUser;
}

export type UsersPermissionsPermissionsTree = Record<
  string,
  {
    /** every controller of the api */
    controllers?: Record<
      string,
      Record<
        string,
        {
          enabled?: boolean;
          policy?: string;
        }
      >
    >;
  }
>;

export type FollowerWithMeta = {
  isFollowing?: boolean;
  totalRecordings?: number;
  recordings?: Recording[];
} & Follower;

export interface BrowseFollowersResponse {
  data?: FollowerWithMeta[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface FollowRequestBody {
  username: string;
  type: FollowerTypeEnum;
}

export interface FilterOption {
  value?: string;
  count?: string;
}

export interface FiltersResponse {
  countries?: FilterOption[];
  countryCodes?: FilterOption[];
  genders?: FilterOption[];
  languages?: FilterOption[];
  languageCodes?: FilterOption[];
  types?: FilterOption[];
}

export enum AiRequestRequestStateEnum {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiRequestTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum AiRequestGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum AiRequestStateEnum {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export enum AiRequestStateEnum1 {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiRequestStateEnum2 {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiRequestStateEnum3 {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiTaskRequestStateEnum {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiTaskTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum AiTaskGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum AiTaskStateEnum {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export enum AiTaskStateEnum1 {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiTaskStateEnum2 {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum AiTaskStateEnum3 {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export enum ClipTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum ClipGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum ClipStateEnum {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export enum FollowerRequestTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum FollowerRequestGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum FollowerGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum FollowerGenderEnum1 {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum MemeRequestTypeEnum {
  ValueMp4 = ".mp4",
  ValueGif = ".gif",
}

export enum MemeTypeEnum {
  ValueMp4 = ".mp4",
  ValueGif = ".gif",
}

export enum MemeTypeEnum1 {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum MemeGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum MemeStateEnum {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export enum MemeTypeEnum2 {
  ValueMp4 = ".mp4",
  ValueGif = ".gif",
}

export enum MessageTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum MessageGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum RecordingGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum SourceRequestStateEnum {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export enum SourceStateEnum {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export enum SourceTypeEnum {
  Tiktok = "tiktok",
  Twitch = "twitch",
  Kick = "kick",
  Youtube = "youtube",
  Afreecatv = "afreecatv",
  Pandalive = "pandalive",
  Bigo = "bigo",
}

export enum SourceGenderEnum {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

export enum SourceStateEnum1 {
  Recording = "recording",
  Done = "done",
  Failed = "failed",
}

export interface GetAiRequestsParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetAiRequestsData = AiRequestListResponse;

export type PostAiRequestsData = AiRequestResponse;

export interface GetAiRequestsIdParams {
  id: string;
}

export type GetAiRequestsIdData = AiRequestResponse;

export interface PutAiRequestsIdParams {
  id: string;
}

export type PutAiRequestsIdData = AiRequestResponse;

export interface DeleteAiRequestsIdParams {
  id: string;
}

/** @format int64 */
export type DeleteAiRequestsIdData = number;

export interface GetAiTasksParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetAiTasksData = AiTaskListResponse;

export type PostAiTasksData = AiTaskResponse;

export interface GetAiTasksIdParams {
  id: string;
}

export type GetAiTasksIdData = AiTaskResponse;

export interface PutAiTasksIdParams {
  id: string;
}

export type PutAiTasksIdData = AiTaskResponse;

export interface DeleteAiTasksIdParams {
  id: string;
}

/** @format int64 */
export type DeleteAiTasksIdData = number;

export interface GetArticlesParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetArticlesData = ArticleListResponse;

export type PostArticlesData = ArticleResponse;

export interface GetArticlesIdParams {
  id: string;
}

export type GetArticlesIdData = ArticleResponse;

export interface PutArticlesIdParams {
  id: string;
}

export type PutArticlesIdData = ArticleResponse;

export interface DeleteArticlesIdParams {
  id: string;
}

/** @format int64 */
export type DeleteArticlesIdData = number;

export interface GetChangeLogsParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetChangeLogsData = ChangeLogListResponse;

export type PostChangeLogsData = ChangeLogResponse;

export interface GetChangeLogsIdParams {
  id: string;
}

export type GetChangeLogsIdData = ChangeLogResponse;

export interface PutChangeLogsIdParams {
  id: string;
}

export type PutChangeLogsIdData = ChangeLogResponse;

export interface DeleteChangeLogsIdParams {
  id: string;
}

/** @format int64 */
export type DeleteChangeLogsIdData = number;

export interface GetClipsParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetClipsData = ClipListResponse;

export type PostClipsData = ClipResponse;

export interface GetClipsIdParams {
  id: string;
}

export type GetClipsIdData = ClipResponse;

export interface PutClipsIdParams {
  id: string;
}

export type PutClipsIdData = ClipResponse;

export interface DeleteClipsIdParams {
  id: string;
}

/** @format int64 */
export type DeleteClipsIdData = number;

export interface GetEmailTemplatesParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetEmailTemplatesData = EmailTemplateListResponse;

export type PostEmailTemplatesData = EmailTemplateResponse;

export interface GetEmailTemplatesIdParams {
  id: string;
}

export type GetEmailTemplatesIdData = EmailTemplateResponse;

export interface PutEmailTemplatesIdParams {
  id: string;
}

export type PutEmailTemplatesIdData = EmailTemplateResponse;

export interface DeleteEmailTemplatesIdParams {
  id: string;
}

/** @format int64 */
export type DeleteEmailTemplatesIdData = number;

export interface GetFollowersParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetFollowersData = FollowerListResponse;

export type PostFollowersData = FollowerResponse;

export interface GetFollowersIdParams {
  id: string;
}

export type GetFollowersIdData = FollowerResponse;

export interface PutFollowersIdParams {
  id: string;
}

export type PutFollowersIdData = FollowerResponse;

export interface DeleteFollowersIdParams {
  id: string;
}

/** @format int64 */
export type DeleteFollowersIdData = number;

export interface GetMemesParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetMemesData = MemeListResponse;

export type PostMemesData = MemeResponse;

export interface GetMemesIdParams {
  id: string;
}

export type GetMemesIdData = MemeResponse;

export interface PutMemesIdParams {
  id: string;
}

export type PutMemesIdData = MemeResponse;

export interface DeleteMemesIdParams {
  id: string;
}

/** @format int64 */
export type DeleteMemesIdData = number;

export interface GetMessagesParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetMessagesData = MessageListResponse;

export type PostMessagesData = MessageResponse;

export interface GetMessagesIdParams {
  id: string;
}

export type GetMessagesIdData = MessageResponse;

export interface PutMessagesIdParams {
  id: string;
}

export type PutMessagesIdData = MessageResponse;

export interface DeleteMessagesIdParams {
  id: string;
}

/** @format int64 */
export type DeleteMessagesIdData = number;

export interface GetRecordingsParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetRecordingsData = RecordingListResponse;

export type PostRecordingsData = RecordingResponse;

export interface GetRecordingsIdParams {
  /** Relations to return */
  populate?: string | string[] | object;
  id: string;
}

export type GetRecordingsIdData = RecordingResponse;

export interface PutRecordingsIdParams {
  id: string;
}

export type PutRecordingsIdData = RecordingResponse;

export interface DeleteRecordingsIdParams {
  id: string;
}

/** @format int64 */
export type DeleteRecordingsIdData = number;

export interface GetSourcesParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
}

export type GetSourcesData = SourceListResponse;

export type PostSourcesData = SourceResponse;

export interface GetSourcesIdParams {
  id: string;
}

export type GetSourcesIdData = SourceResponse;

export interface PutSourcesIdParams {
  id: string;
}

export type PutSourcesIdData = SourceResponse;

export interface DeleteSourcesIdParams {
  id: string;
}

/** @format int64 */
export type DeleteSourcesIdData = number;

/** Upload files */
export interface UploadCreatePayload {
  /** The folder where the file(s) will be uploaded to (only supported on strapi-provider-upload-aws-s3). */
  path?: string;
  /** The ID of the entry which the file(s) will be linked to */
  refId?: string;
  /** The unique ID (uid) of the model which the file(s) will be linked to (api::restaurant.restaurant). */
  ref?: string;
  /** The field of the entry which the file(s) will be precisely linked to. */
  field?: string;
  files: File[];
}

export type UploadCreateData = UploadFile[];

/** Upload files */
export interface UploadIdCreatePayload {
  fileInfo?: {
    name?: string;
    alternativeText?: string;
    caption?: string;
  };
  /** @format binary */
  files?: File;
}

export interface UploadIdCreateParams {
  id: string;
}

export type UploadIdCreateData = UploadFile[];

export type FilesListData = UploadFile[];

export interface FilesDetailParams {
  id: string;
}

export type FilesDetailData = UploadFile;

export interface FilesDeleteParams {
  id: string;
}

export type FilesDeleteData = UploadFile;

export interface ConnectDetailParams {
  /**
   * Provider name
   * @pattern .*
   */
  provider: string;
}

export interface LocalCreatePayload {
  identifier?: string;
  password?: string;
}

export type LocalCreateData = UsersPermissionsUserRegistration;

export interface LocalRegisterCreatePayload {
  username?: string;
  email?: string;
  password?: string;
}

export type LocalRegisterCreateData = UsersPermissionsUserRegistration;

export interface CallbackListParams {
  /** Provider name */
  provider: string;
}

export type CallbackListData = UsersPermissionsUserRegistration;

export enum OkEnum {
  True = true,
}

export interface ForgotPasswordCreatePayload {
  email?: string;
}

export interface ForgotPasswordCreateData {
  ok?: OkEnum;
}

export interface ResetPasswordCreatePayload {
  password?: string;
  passwordConfirmation?: string;
  code?: string;
}

export type ResetPasswordCreateData = UsersPermissionsUserRegistration;

export interface ChangePasswordCreatePayload {
  password: string;
  currentPassword: string;
  passwordConfirmation: string;
}

export type ChangePasswordCreateData = UsersPermissionsUserRegistration;

export interface EmailConfirmationListParams {
  /** confirmation token received by email */
  confirmation?: string;
}

export enum SentEnum {
  True = true,
}

export interface SendEmailConfirmationCreatePayload {
  email?: string;
}

export interface SendEmailConfirmationCreateData {
  email?: string;
  sent?: SentEnum;
}

export interface PermissionsListData {
  permissions?: UsersPermissionsPermissionsTree;
}

export interface RolesListData {
  roles?: (UsersPermissionsRole & {
    nb_users?: number;
  })[];
}

export enum OkEnum1 {
  True = true,
}

export interface RolesCreateData {
  ok?: OkEnum1;
}

export interface RolesDetailParams {
  /** role Id */
  id: string;
}

export interface RolesDetailData {
  role?: UsersPermissionsRole;
}

export enum OkEnum2 {
  True = true,
}

export interface RolesUpdateParams {
  /** role Id */
  role: string;
}

export interface RolesUpdateData {
  ok?: OkEnum2;
}

export enum OkEnum3 {
  True = true,
}

export interface RolesDeleteParams {
  /** role Id */
  role: string;
}

export interface RolesDeleteData {
  ok?: OkEnum3;
}

export type UsersListData = UsersPermissionsUser[];

export interface UsersCreatePayload {
  email: string;
  username: string;
  password: string;
}

export type UsersCreateData = UsersPermissionsUser & {
  role?: UsersPermissionsRole;
};

export interface UsersDetailParams {
  /** user Id */
  id: string;
}

export type UsersDetailData = UsersPermissionsUser;

export interface UsersUpdatePayload {
  email: string;
  username: string;
  password: string;
}

export interface UsersUpdateParams {
  /** user Id */
  id: string;
}

export type UsersUpdateData = UsersPermissionsUser & {
  role?: UsersPermissionsRole;
};

export interface UsersDeleteParams {
  /** user Id */
  id: string;
}

export type UsersDeleteData = UsersPermissionsUser;

export interface GetUsersPermissionsUsersRolesParams {
  /** Relations to populate */
  populate?: string | string[] | object;
}

export type GetUsersPermissionsUsersRolesData = UsersPermissionsUser & {
  role?: {
    id?: number;
    name?: string;
    description?: string;
    type?: string;
  };
};

export type CountListData = number;

export interface GetRandomClipsParams {
  /**
   * Number of clips to return
   * @default 12
   */
  limit?: number;
}

export interface GetRandomClipsData {
  data?: Clip[];
}

export interface BrowseFollowersParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
  /** Filter by follow status: 'following' (only followed), 'discover' (not followed), or omit for all */
  scope?: ScopeEnum;
  /** Filter to only return followers with at least 1 recording */
  hasRecordings?: boolean;
}

export type BrowseFollowersData = BrowseFollowersResponse;

export interface BrowseRecordingsParams {
  /** Sort by attributes ascending (asc) or descending (desc) */
  sort?: string;
  /** Return page/pageSize (default: true) */
  "pagination[withCount]"?: boolean;
  /** Page number (default: 0) */
  "pagination[page]"?: number;
  /** Page size (default: 25) */
  "pagination[pageSize]"?: number;
  /** Offset value (default: 0) */
  "pagination[start]"?: number;
  /** Number of entities to return (default: 25) */
  "pagination[limit]"?: number;
  /** Fields to return (ex: title,author) */
  fields?: string;
  /** Relations to return */
  populate?: string | string[] | object;
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Locale to apply */
  locale?: string;
  /** Filter by follow status: 'following' (only followed), 'discover' (not followed), or omit for all */
  scope?: ScopeEnum;
}

export type BrowseRecordingsData = RecordingListResponse;

export interface FollowCreateData {
  data?: Follower;
}

export interface UnfollowCreateData {
  success?: boolean;
}

export type GetFollowerFiltersData = FiltersResponse;

export namespace AiRequest {
  /**
   * No description
   * @tags Ai-request
   * @name GetAiRequests
   * @request GET:/ai-requests
   * @secure
   */
  export namespace GetAiRequests {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAiRequestsData;
  }

  /**
   * No description
   * @tags Ai-request
   * @name PostAiRequests
   * @request POST:/ai-requests
   * @secure
   */
  export namespace PostAiRequests {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AiRequestRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostAiRequestsData;
  }

  /**
   * No description
   * @tags Ai-request
   * @name GetAiRequestsId
   * @request GET:/ai-requests/{id}
   * @secure
   */
  export namespace GetAiRequestsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAiRequestsIdData;
  }

  /**
   * No description
   * @tags Ai-request
   * @name PutAiRequestsId
   * @request PUT:/ai-requests/{id}
   * @secure
   */
  export namespace PutAiRequestsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AiRequestRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutAiRequestsIdData;
  }

  /**
   * No description
   * @tags Ai-request
   * @name DeleteAiRequestsId
   * @request DELETE:/ai-requests/{id}
   * @secure
   */
  export namespace DeleteAiRequestsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteAiRequestsIdData;
  }
}

export namespace AiTask {
  /**
   * No description
   * @tags Ai-task
   * @name GetAiTasks
   * @request GET:/ai-tasks
   * @secure
   */
  export namespace GetAiTasks {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAiTasksData;
  }

  /**
   * No description
   * @tags Ai-task
   * @name PostAiTasks
   * @request POST:/ai-tasks
   * @secure
   */
  export namespace PostAiTasks {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AiTaskRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostAiTasksData;
  }

  /**
   * No description
   * @tags Ai-task
   * @name GetAiTasksId
   * @request GET:/ai-tasks/{id}
   * @secure
   */
  export namespace GetAiTasksId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAiTasksIdData;
  }

  /**
   * No description
   * @tags Ai-task
   * @name PutAiTasksId
   * @request PUT:/ai-tasks/{id}
   * @secure
   */
  export namespace PutAiTasksId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AiTaskRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutAiTasksIdData;
  }

  /**
   * No description
   * @tags Ai-task
   * @name DeleteAiTasksId
   * @request DELETE:/ai-tasks/{id}
   * @secure
   */
  export namespace DeleteAiTasksId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteAiTasksIdData;
  }
}

export namespace Article {
  /**
   * No description
   * @tags Article
   * @name GetArticles
   * @request GET:/articles
   * @secure
   */
  export namespace GetArticles {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetArticlesData;
  }

  /**
   * No description
   * @tags Article
   * @name PostArticles
   * @request POST:/articles
   * @secure
   */
  export namespace PostArticles {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ArticleRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostArticlesData;
  }

  /**
   * No description
   * @tags Article
   * @name GetArticlesId
   * @request GET:/articles/{id}
   * @secure
   */
  export namespace GetArticlesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetArticlesIdData;
  }

  /**
   * No description
   * @tags Article
   * @name PutArticlesId
   * @request PUT:/articles/{id}
   * @secure
   */
  export namespace PutArticlesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ArticleRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutArticlesIdData;
  }

  /**
   * No description
   * @tags Article
   * @name DeleteArticlesId
   * @request DELETE:/articles/{id}
   * @secure
   */
  export namespace DeleteArticlesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteArticlesIdData;
  }
}

export namespace ChangeLog {
  /**
   * No description
   * @tags Change-log
   * @name GetChangeLogs
   * @request GET:/change-logs
   * @secure
   */
  export namespace GetChangeLogs {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetChangeLogsData;
  }

  /**
   * No description
   * @tags Change-log
   * @name PostChangeLogs
   * @request POST:/change-logs
   * @secure
   */
  export namespace PostChangeLogs {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangeLogRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostChangeLogsData;
  }

  /**
   * No description
   * @tags Change-log
   * @name GetChangeLogsId
   * @request GET:/change-logs/{id}
   * @secure
   */
  export namespace GetChangeLogsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetChangeLogsIdData;
  }

  /**
   * No description
   * @tags Change-log
   * @name PutChangeLogsId
   * @request PUT:/change-logs/{id}
   * @secure
   */
  export namespace PutChangeLogsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ChangeLogRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutChangeLogsIdData;
  }

  /**
   * No description
   * @tags Change-log
   * @name DeleteChangeLogsId
   * @request DELETE:/change-logs/{id}
   * @secure
   */
  export namespace DeleteChangeLogsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteChangeLogsIdData;
  }
}

export namespace Clip {
  /**
   * No description
   * @tags Clip
   * @name GetClips
   * @request GET:/clips
   * @secure
   */
  export namespace GetClips {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetClipsData;
  }

  /**
   * No description
   * @tags Clip
   * @name PostClips
   * @request POST:/clips
   * @secure
   */
  export namespace PostClips {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ClipRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostClipsData;
  }

  /**
   * No description
   * @tags Clip
   * @name GetClipsId
   * @request GET:/clips/{id}
   * @secure
   */
  export namespace GetClipsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetClipsIdData;
  }

  /**
   * No description
   * @tags Clip
   * @name PutClipsId
   * @request PUT:/clips/{id}
   * @secure
   */
  export namespace PutClipsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ClipRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutClipsIdData;
  }

  /**
   * No description
   * @tags Clip
   * @name DeleteClipsId
   * @request DELETE:/clips/{id}
   * @secure
   */
  export namespace DeleteClipsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteClipsIdData;
  }

  /**
   * No description
   * @tags Clip
   * @name GetRandomClips
   * @summary Get random clips (one per user)
   * @request GET:/clips/random
   * @secure
   */
  export namespace GetRandomClips {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Number of clips to return
       * @default 12
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRandomClipsData;
  }
}

export namespace EmailTemplate {
  /**
   * No description
   * @tags Email-template
   * @name GetEmailTemplates
   * @request GET:/email-templates
   * @secure
   */
  export namespace GetEmailTemplates {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEmailTemplatesData;
  }

  /**
   * No description
   * @tags Email-template
   * @name PostEmailTemplates
   * @request POST:/email-templates
   * @secure
   */
  export namespace PostEmailTemplates {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EmailTemplateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostEmailTemplatesData;
  }

  /**
   * No description
   * @tags Email-template
   * @name GetEmailTemplatesId
   * @request GET:/email-templates/{id}
   * @secure
   */
  export namespace GetEmailTemplatesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEmailTemplatesIdData;
  }

  /**
   * No description
   * @tags Email-template
   * @name PutEmailTemplatesId
   * @request PUT:/email-templates/{id}
   * @secure
   */
  export namespace PutEmailTemplatesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = EmailTemplateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutEmailTemplatesIdData;
  }

  /**
   * No description
   * @tags Email-template
   * @name DeleteEmailTemplatesId
   * @request DELETE:/email-templates/{id}
   * @secure
   */
  export namespace DeleteEmailTemplatesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteEmailTemplatesIdData;
  }
}

export namespace Follower {
  /**
   * No description
   * @tags Follower
   * @name GetFollowers
   * @request GET:/followers
   * @secure
   */
  export namespace GetFollowers {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetFollowersData;
  }

  /**
   * No description
   * @tags Follower
   * @name PostFollowers
   * @request POST:/followers
   * @secure
   */
  export namespace PostFollowers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FollowerRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostFollowersData;
  }

  /**
   * No description
   * @tags Follower
   * @name GetFollowersId
   * @request GET:/followers/{id}
   * @secure
   */
  export namespace GetFollowersId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetFollowersIdData;
  }

  /**
   * No description
   * @tags Follower
   * @name PutFollowersId
   * @request PUT:/followers/{id}
   * @secure
   */
  export namespace PutFollowersId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = FollowerRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutFollowersIdData;
  }

  /**
   * No description
   * @tags Follower
   * @name DeleteFollowersId
   * @request DELETE:/followers/{id}
   * @secure
   */
  export namespace DeleteFollowersId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteFollowersIdData;
  }

  /**
   * No description
   * @tags Follower
   * @name BrowseFollowers
   * @summary Browse followers with scope filtering (auth required)
   * @request GET:/followers/browse
   * @secure
   */
  export namespace BrowseFollowers {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
      /** Filter by follow status: 'following' (only followed), 'discover' (not followed), or omit for all */
      scope?: ScopeEnum;
      /** Filter to only return followers with at least 1 recording */
      hasRecordings?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BrowseFollowersData;
  }

  /**
   * No description
   * @tags Follower
   * @name FollowCreate
   * @summary Follow a new account
   * @request POST:/followers/follow
   * @secure
   */
  export namespace FollowCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FollowRequestBody;
    export type RequestHeaders = {};
    export type ResponseBody = FollowCreateData;
  }

  /**
   * No description
   * @tags Follower
   * @name UnfollowCreate
   * @summary Unfollow an account
   * @request POST:/followers/unfollow
   * @secure
   */
  export namespace UnfollowCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FollowRequestBody;
    export type RequestHeaders = {};
    export type ResponseBody = UnfollowCreateData;
  }

  /**
   * No description
   * @tags Follower
   * @name GetFollowerFilters
   * @summary Get available filter options with counts
   * @request GET:/followers/filters
   * @secure
   */
  export namespace GetFollowerFilters {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetFollowerFiltersData;
  }
}

export namespace Meme {
  /**
   * No description
   * @tags Meme
   * @name GetMemes
   * @request GET:/memes
   * @secure
   */
  export namespace GetMemes {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMemesData;
  }

  /**
   * No description
   * @tags Meme
   * @name PostMemes
   * @request POST:/memes
   * @secure
   */
  export namespace PostMemes {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MemeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostMemesData;
  }

  /**
   * No description
   * @tags Meme
   * @name GetMemesId
   * @request GET:/memes/{id}
   * @secure
   */
  export namespace GetMemesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMemesIdData;
  }

  /**
   * No description
   * @tags Meme
   * @name PutMemesId
   * @request PUT:/memes/{id}
   * @secure
   */
  export namespace PutMemesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = MemeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutMemesIdData;
  }

  /**
   * No description
   * @tags Meme
   * @name DeleteMemesId
   * @request DELETE:/memes/{id}
   * @secure
   */
  export namespace DeleteMemesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteMemesIdData;
  }
}

export namespace Message {
  /**
   * No description
   * @tags Message
   * @name GetMessages
   * @request GET:/messages
   * @secure
   */
  export namespace GetMessages {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMessagesData;
  }

  /**
   * No description
   * @tags Message
   * @name PostMessages
   * @request POST:/messages
   * @secure
   */
  export namespace PostMessages {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MessageRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostMessagesData;
  }

  /**
   * No description
   * @tags Message
   * @name GetMessagesId
   * @request GET:/messages/{id}
   * @secure
   */
  export namespace GetMessagesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMessagesIdData;
  }

  /**
   * No description
   * @tags Message
   * @name PutMessagesId
   * @request PUT:/messages/{id}
   * @secure
   */
  export namespace PutMessagesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = MessageRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutMessagesIdData;
  }

  /**
   * No description
   * @tags Message
   * @name DeleteMessagesId
   * @request DELETE:/messages/{id}
   * @secure
   */
  export namespace DeleteMessagesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteMessagesIdData;
  }
}

export namespace Recording {
  /**
   * No description
   * @tags Recording
   * @name GetRecordings
   * @request GET:/recordings
   * @secure
   */
  export namespace GetRecordings {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRecordingsData;
  }

  /**
   * No description
   * @tags Recording
   * @name PostRecordings
   * @request POST:/recordings
   * @secure
   */
  export namespace PostRecordings {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RecordingRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostRecordingsData;
  }

  /**
   * No description
   * @tags Recording
   * @name GetRecordingsId
   * @request GET:/recordings/{id}
   * @secure
   */
  export namespace GetRecordingsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {
      /** Relations to return */
      populate?: string | string[] | object;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRecordingsIdData;
  }

  /**
   * No description
   * @tags Recording
   * @name PutRecordingsId
   * @request PUT:/recordings/{id}
   * @secure
   */
  export namespace PutRecordingsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RecordingRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutRecordingsIdData;
  }

  /**
   * No description
   * @tags Recording
   * @name DeleteRecordingsId
   * @request DELETE:/recordings/{id}
   * @secure
   */
  export namespace DeleteRecordingsId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteRecordingsIdData;
  }

  /**
   * No description
   * @tags Recording
   * @name BrowseRecordings
   * @summary Browse recordings with scope filtering (auth required)
   * @request GET:/recordings/browse
   * @secure
   */
  export namespace BrowseRecordings {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
      /** Filter by follow status: 'following' (only followed), 'discover' (not followed), or omit for all */
      scope?: ScopeEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BrowseRecordingsData;
  }
}

export namespace Source {
  /**
   * No description
   * @tags Source
   * @name GetSources
   * @request GET:/sources
   * @secure
   */
  export namespace GetSources {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Sort by attributes ascending (asc) or descending (desc) */
      sort?: string;
      /** Return page/pageSize (default: true) */
      "pagination[withCount]"?: boolean;
      /** Page number (default: 0) */
      "pagination[page]"?: number;
      /** Page size (default: 25) */
      "pagination[pageSize]"?: number;
      /** Offset value (default: 0) */
      "pagination[start]"?: number;
      /** Number of entities to return (default: 25) */
      "pagination[limit]"?: number;
      /** Fields to return (ex: title,author) */
      fields?: string;
      /** Relations to return */
      populate?: string | string[] | object;
      /** Filters to apply */
      filters?: Record<string, any>;
      /** Locale to apply */
      locale?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSourcesData;
  }

  /**
   * No description
   * @tags Source
   * @name PostSources
   * @request POST:/sources
   * @secure
   */
  export namespace PostSources {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SourceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PostSourcesData;
  }

  /**
   * No description
   * @tags Source
   * @name GetSourcesId
   * @request GET:/sources/{id}
   * @secure
   */
  export namespace GetSourcesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSourcesIdData;
  }

  /**
   * No description
   * @tags Source
   * @name PutSourcesId
   * @request PUT:/sources/{id}
   * @secure
   */
  export namespace PutSourcesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = SourceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PutSourcesIdData;
  }

  /**
   * No description
   * @tags Source
   * @name DeleteSourcesId
   * @request DELETE:/sources/{id}
   * @secure
   */
  export namespace DeleteSourcesId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteSourcesIdData;
  }
}

export namespace UploadFile {
  /**
   * @description Upload files
   * @tags Upload - File
   * @name UploadCreate
   * @request POST:/upload
   * @secure
   */
  export namespace UploadCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UploadCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UploadCreateData;
  }

  /**
   * @description Upload file information
   * @tags Upload - File
   * @name UploadIdCreate
   * @request POST:/upload?id={id}
   * @secure
   */
  export namespace UploadIdCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {
      /** File id */
      id: string;
    };
    export type RequestBody = UploadIdCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UploadIdCreateData;
  }

  /**
   * No description
   * @tags Upload - File
   * @name FilesList
   * @request GET:/upload/files
   * @secure
   */
  export namespace FilesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FilesListData;
  }

  /**
   * No description
   * @tags Upload - File
   * @name FilesDetail
   * @request GET:/upload/files/{id}
   * @secure
   */
  export namespace FilesDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FilesDetailData;
  }

  /**
   * No description
   * @tags Upload - File
   * @name FilesDelete
   * @request DELETE:/upload/files/{id}
   * @secure
   */
  export namespace FilesDelete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FilesDeleteData;
  }
}

export namespace UsersPermissionsAuth {
  /**
   * @description Redirects to provider login before being redirect to /auth/{provider}/callback
   * @tags Users-Permissions - Auth
   * @name ConnectDetail
   * @summary Login with a provider
   * @request GET:/connect/{provider}
   * @secure
   */
  export namespace ConnectDetail {
    export type RequestParams = {
      /**
       * Provider name
       * @pattern .*
       */
      provider: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * @description Returns a jwt token and user info
   * @tags Users-Permissions - Auth
   * @name LocalCreate
   * @summary Local login
   * @request POST:/auth/local
   * @secure
   */
  export namespace LocalCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LocalCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = LocalCreateData;
  }

  /**
   * @description Returns a jwt token and user info
   * @tags Users-Permissions - Auth
   * @name LocalRegisterCreate
   * @summary Register a user
   * @request POST:/auth/local/register
   * @secure
   */
  export namespace LocalRegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LocalRegisterCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = LocalRegisterCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name CallbackList
   * @summary Default Callback from provider auth
   * @request GET:/auth/{provider}/callback
   * @secure
   */
  export namespace CallbackList {
    export type RequestParams = {
      /** Provider name */
      provider: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CallbackListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name ForgotPasswordCreate
   * @summary Send rest password email
   * @request POST:/auth/forgot-password
   * @secure
   */
  export namespace ForgotPasswordCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ForgotPasswordCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ForgotPasswordCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name ResetPasswordCreate
   * @summary Rest user password
   * @request POST:/auth/reset-password
   * @secure
   */
  export namespace ResetPasswordCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ResetPasswordCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ResetPasswordCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name ChangePasswordCreate
   * @summary Update user's own password
   * @request POST:/auth/change-password
   * @secure
   */
  export namespace ChangePasswordCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangePasswordCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangePasswordCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name EmailConfirmationList
   * @summary Confirm user email
   * @request GET:/auth/email-confirmation
   * @secure
   */
  export namespace EmailConfirmationList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** confirmation token received by email */
      confirmation?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @tags Users-Permissions - Auth
   * @name SendEmailConfirmationCreate
   * @summary Send confirmation email
   * @request POST:/auth/send-email-confirmation
   * @secure
   */
  export namespace SendEmailConfirmationCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendEmailConfirmationCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = SendEmailConfirmationCreateData;
  }
}

export namespace UsersPermissionsUsersRoles {
  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name PermissionsList
   * @summary Get default generated permissions
   * @request GET:/users-permissions/permissions
   * @secure
   */
  export namespace PermissionsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PermissionsListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesList
   * @summary List roles
   * @request GET:/users-permissions/roles
   * @secure
   */
  export namespace RolesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RolesListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesCreate
   * @summary Create a role
   * @request POST:/users-permissions/roles
   * @secure
   */
  export namespace RolesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      name?: string;
      description?: string;
      type?: string;
      permissions?: UsersPermissionsPermissionsTree;
    };
    export type RequestHeaders = {};
    export type ResponseBody = RolesCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesDetail
   * @summary Get a role
   * @request GET:/users-permissions/roles/{id}
   * @secure
   */
  export namespace RolesDetail {
    export type RequestParams = {
      /** role Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RolesDetailData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesUpdate
   * @summary Update a role
   * @request PUT:/users-permissions/roles/{role}
   * @secure
   */
  export namespace RolesUpdate {
    export type RequestParams = {
      /** role Id */
      role: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {
      name?: string;
      description?: string;
      type?: string;
      permissions?: UsersPermissionsPermissionsTree;
    };
    export type RequestHeaders = {};
    export type ResponseBody = RolesUpdateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name RolesDelete
   * @summary Delete a role
   * @request DELETE:/users-permissions/roles/{role}
   * @secure
   */
  export namespace RolesDelete {
    export type RequestParams = {
      /** role Id */
      role: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RolesDeleteData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersList
   * @summary Get list of users
   * @request GET:/users
   * @secure
   */
  export namespace UsersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersListData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersCreate
   * @summary Create a user
   * @request POST:/users
   * @secure
   */
  export namespace UsersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UsersCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UsersCreateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersDetail
   * @summary Get a user
   * @request GET:/users/{id}
   * @secure
   */
  export namespace UsersDetail {
    export type RequestParams = {
      /** user Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersDetailData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersUpdate
   * @summary Update a user
   * @request PUT:/users/{id}
   * @secure
   */
  export namespace UsersUpdate {
    export type RequestParams = {
      /** user Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UsersUpdatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UsersUpdateData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name UsersDelete
   * @summary Delete a user
   * @request DELETE:/users/{id}
   * @secure
   */
  export namespace UsersDelete {
    export type RequestParams = {
      /** user Id */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsersDeleteData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name GetUsersPermissionsUsersRoles
   * @summary Get authenticated user info
   * @request GET:/users/me
   * @secure
   */
  export namespace GetUsersPermissionsUsersRoles {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Relations to populate */
      populate?: string | string[] | object;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUsersPermissionsUsersRolesData;
  }

  /**
   * No description
   * @tags Users-Permissions - Users & Roles
   * @name CountList
   * @summary Get user count
   * @request GET:/users/count
   * @secure
   */
  export namespace CountList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CountListData;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:1337/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title DOCUMENTATION
 * @version 1.0.0
 * @license Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService YOUR_TERMS_OF_SERVICE_URL
 * @baseUrl http://localhost:1337/api
 * @externalDocs https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html
 * @contact TEAM <contact-email@something.io> (mywebsite.io)
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  aiRequest = {
    /**
     * No description
     *
     * @tags Ai-request
     * @name GetAiRequests
     * @request GET:/ai-requests
     * @secure
     */
    getAiRequests: (query: GetAiRequestsParams, params: RequestParams = {}) =>
      this.request<GetAiRequestsData, Error>({
        path: `/ai-requests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-request
     * @name PostAiRequests
     * @request POST:/ai-requests
     * @secure
     */
    postAiRequests: (data: AiRequestRequest, params: RequestParams = {}) =>
      this.request<PostAiRequestsData, Error>({
        path: `/ai-requests`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-request
     * @name GetAiRequestsId
     * @request GET:/ai-requests/{id}
     * @secure
     */
    getAiRequestsId: (
      { id, ...query }: GetAiRequestsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAiRequestsIdData, Error>({
        path: `/ai-requests/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-request
     * @name PutAiRequestsId
     * @request PUT:/ai-requests/{id}
     * @secure
     */
    putAiRequestsId: (
      { id, ...query }: PutAiRequestsIdParams,
      data: AiRequestRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutAiRequestsIdData, Error>({
        path: `/ai-requests/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-request
     * @name DeleteAiRequestsId
     * @request DELETE:/ai-requests/{id}
     * @secure
     */
    deleteAiRequestsId: (
      { id, ...query }: DeleteAiRequestsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteAiRequestsIdData, Error>({
        path: `/ai-requests/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  aiTask = {
    /**
     * No description
     *
     * @tags Ai-task
     * @name GetAiTasks
     * @request GET:/ai-tasks
     * @secure
     */
    getAiTasks: (query: GetAiTasksParams, params: RequestParams = {}) =>
      this.request<GetAiTasksData, Error>({
        path: `/ai-tasks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-task
     * @name PostAiTasks
     * @request POST:/ai-tasks
     * @secure
     */
    postAiTasks: (data: AiTaskRequest, params: RequestParams = {}) =>
      this.request<PostAiTasksData, Error>({
        path: `/ai-tasks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-task
     * @name GetAiTasksId
     * @request GET:/ai-tasks/{id}
     * @secure
     */
    getAiTasksId: (
      { id, ...query }: GetAiTasksIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAiTasksIdData, Error>({
        path: `/ai-tasks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-task
     * @name PutAiTasksId
     * @request PUT:/ai-tasks/{id}
     * @secure
     */
    putAiTasksId: (
      { id, ...query }: PutAiTasksIdParams,
      data: AiTaskRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutAiTasksIdData, Error>({
        path: `/ai-tasks/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ai-task
     * @name DeleteAiTasksId
     * @request DELETE:/ai-tasks/{id}
     * @secure
     */
    deleteAiTasksId: (
      { id, ...query }: DeleteAiTasksIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteAiTasksIdData, Error>({
        path: `/ai-tasks/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  article = {
    /**
     * No description
     *
     * @tags Article
     * @name GetArticles
     * @request GET:/articles
     * @secure
     */
    getArticles: (query: GetArticlesParams, params: RequestParams = {}) =>
      this.request<GetArticlesData, Error>({
        path: `/articles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article
     * @name PostArticles
     * @request POST:/articles
     * @secure
     */
    postArticles: (data: ArticleRequest, params: RequestParams = {}) =>
      this.request<PostArticlesData, Error>({
        path: `/articles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article
     * @name GetArticlesId
     * @request GET:/articles/{id}
     * @secure
     */
    getArticlesId: (
      { id, ...query }: GetArticlesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetArticlesIdData, Error>({
        path: `/articles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article
     * @name PutArticlesId
     * @request PUT:/articles/{id}
     * @secure
     */
    putArticlesId: (
      { id, ...query }: PutArticlesIdParams,
      data: ArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutArticlesIdData, Error>({
        path: `/articles/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article
     * @name DeleteArticlesId
     * @request DELETE:/articles/{id}
     * @secure
     */
    deleteArticlesId: (
      { id, ...query }: DeleteArticlesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteArticlesIdData, Error>({
        path: `/articles/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  changeLog = {
    /**
     * No description
     *
     * @tags Change-log
     * @name GetChangeLogs
     * @request GET:/change-logs
     * @secure
     */
    getChangeLogs: (query: GetChangeLogsParams, params: RequestParams = {}) =>
      this.request<GetChangeLogsData, Error>({
        path: `/change-logs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Change-log
     * @name PostChangeLogs
     * @request POST:/change-logs
     * @secure
     */
    postChangeLogs: (data: ChangeLogRequest, params: RequestParams = {}) =>
      this.request<PostChangeLogsData, Error>({
        path: `/change-logs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Change-log
     * @name GetChangeLogsId
     * @request GET:/change-logs/{id}
     * @secure
     */
    getChangeLogsId: (
      { id, ...query }: GetChangeLogsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetChangeLogsIdData, Error>({
        path: `/change-logs/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Change-log
     * @name PutChangeLogsId
     * @request PUT:/change-logs/{id}
     * @secure
     */
    putChangeLogsId: (
      { id, ...query }: PutChangeLogsIdParams,
      data: ChangeLogRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutChangeLogsIdData, Error>({
        path: `/change-logs/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Change-log
     * @name DeleteChangeLogsId
     * @request DELETE:/change-logs/{id}
     * @secure
     */
    deleteChangeLogsId: (
      { id, ...query }: DeleteChangeLogsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteChangeLogsIdData, Error>({
        path: `/change-logs/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  clip = {
    /**
     * No description
     *
     * @tags Clip
     * @name GetClips
     * @request GET:/clips
     * @secure
     */
    getClips: (query: GetClipsParams, params: RequestParams = {}) =>
      this.request<GetClipsData, Error>({
        path: `/clips`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clip
     * @name PostClips
     * @request POST:/clips
     * @secure
     */
    postClips: (data: ClipRequest, params: RequestParams = {}) =>
      this.request<PostClipsData, Error>({
        path: `/clips`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clip
     * @name GetClipsId
     * @request GET:/clips/{id}
     * @secure
     */
    getClipsId: (
      { id, ...query }: GetClipsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetClipsIdData, Error>({
        path: `/clips/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clip
     * @name PutClipsId
     * @request PUT:/clips/{id}
     * @secure
     */
    putClipsId: (
      { id, ...query }: PutClipsIdParams,
      data: ClipRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutClipsIdData, Error>({
        path: `/clips/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clip
     * @name DeleteClipsId
     * @request DELETE:/clips/{id}
     * @secure
     */
    deleteClipsId: (
      { id, ...query }: DeleteClipsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteClipsIdData, Error>({
        path: `/clips/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Clip
     * @name GetRandomClips
     * @summary Get random clips (one per user)
     * @request GET:/clips/random
     * @secure
     */
    getRandomClips: (query: GetRandomClipsParams, params: RequestParams = {}) =>
      this.request<GetRandomClipsData, any>({
        path: `/clips/random`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  emailTemplate = {
    /**
     * No description
     *
     * @tags Email-template
     * @name GetEmailTemplates
     * @request GET:/email-templates
     * @secure
     */
    getEmailTemplates: (
      query: GetEmailTemplatesParams,
      params: RequestParams = {},
    ) =>
      this.request<GetEmailTemplatesData, Error>({
        path: `/email-templates`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email-template
     * @name PostEmailTemplates
     * @request POST:/email-templates
     * @secure
     */
    postEmailTemplates: (
      data: EmailTemplateRequest,
      params: RequestParams = {},
    ) =>
      this.request<PostEmailTemplatesData, Error>({
        path: `/email-templates`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email-template
     * @name GetEmailTemplatesId
     * @request GET:/email-templates/{id}
     * @secure
     */
    getEmailTemplatesId: (
      { id, ...query }: GetEmailTemplatesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetEmailTemplatesIdData, Error>({
        path: `/email-templates/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email-template
     * @name PutEmailTemplatesId
     * @request PUT:/email-templates/{id}
     * @secure
     */
    putEmailTemplatesId: (
      { id, ...query }: PutEmailTemplatesIdParams,
      data: EmailTemplateRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutEmailTemplatesIdData, Error>({
        path: `/email-templates/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email-template
     * @name DeleteEmailTemplatesId
     * @request DELETE:/email-templates/{id}
     * @secure
     */
    deleteEmailTemplatesId: (
      { id, ...query }: DeleteEmailTemplatesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteEmailTemplatesIdData, Error>({
        path: `/email-templates/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  follower = {
    /**
     * No description
     *
     * @tags Follower
     * @name GetFollowers
     * @request GET:/followers
     * @secure
     */
    getFollowers: (query: GetFollowersParams, params: RequestParams = {}) =>
      this.request<GetFollowersData, Error>({
        path: `/followers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name PostFollowers
     * @request POST:/followers
     * @secure
     */
    postFollowers: (data: FollowerRequest, params: RequestParams = {}) =>
      this.request<PostFollowersData, Error>({
        path: `/followers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name GetFollowersId
     * @request GET:/followers/{id}
     * @secure
     */
    getFollowersId: (
      { id, ...query }: GetFollowersIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetFollowersIdData, Error>({
        path: `/followers/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name PutFollowersId
     * @request PUT:/followers/{id}
     * @secure
     */
    putFollowersId: (
      { id, ...query }: PutFollowersIdParams,
      data: FollowerRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutFollowersIdData, Error>({
        path: `/followers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name DeleteFollowersId
     * @request DELETE:/followers/{id}
     * @secure
     */
    deleteFollowersId: (
      { id, ...query }: DeleteFollowersIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteFollowersIdData, Error>({
        path: `/followers/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name BrowseFollowers
     * @summary Browse followers with scope filtering (auth required)
     * @request GET:/followers/browse
     * @secure
     */
    browseFollowers: (
      query: BrowseFollowersParams,
      params: RequestParams = {},
    ) =>
      this.request<BrowseFollowersData, Error | void>({
        path: `/followers/browse`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name FollowCreate
     * @summary Follow a new account
     * @request POST:/followers/follow
     * @secure
     */
    followCreate: (data: FollowRequestBody, params: RequestParams = {}) =>
      this.request<FollowCreateData, void>({
        path: `/followers/follow`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name UnfollowCreate
     * @summary Unfollow an account
     * @request POST:/followers/unfollow
     * @secure
     */
    unfollowCreate: (data: FollowRequestBody, params: RequestParams = {}) =>
      this.request<UnfollowCreateData, void>({
        path: `/followers/unfollow`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follower
     * @name GetFollowerFilters
     * @summary Get available filter options with counts
     * @request GET:/followers/filters
     * @secure
     */
    getFollowerFilters: (params: RequestParams = {}) =>
      this.request<GetFollowerFiltersData, void>({
        path: `/followers/filters`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  meme = {
    /**
     * No description
     *
     * @tags Meme
     * @name GetMemes
     * @request GET:/memes
     * @secure
     */
    getMemes: (query: GetMemesParams, params: RequestParams = {}) =>
      this.request<GetMemesData, Error>({
        path: `/memes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meme
     * @name PostMemes
     * @request POST:/memes
     * @secure
     */
    postMemes: (data: MemeRequest, params: RequestParams = {}) =>
      this.request<PostMemesData, Error>({
        path: `/memes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meme
     * @name GetMemesId
     * @request GET:/memes/{id}
     * @secure
     */
    getMemesId: (
      { id, ...query }: GetMemesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetMemesIdData, Error>({
        path: `/memes/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meme
     * @name PutMemesId
     * @request PUT:/memes/{id}
     * @secure
     */
    putMemesId: (
      { id, ...query }: PutMemesIdParams,
      data: MemeRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutMemesIdData, Error>({
        path: `/memes/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meme
     * @name DeleteMemesId
     * @request DELETE:/memes/{id}
     * @secure
     */
    deleteMemesId: (
      { id, ...query }: DeleteMemesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteMemesIdData, Error>({
        path: `/memes/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  message = {
    /**
     * No description
     *
     * @tags Message
     * @name GetMessages
     * @request GET:/messages
     * @secure
     */
    getMessages: (query: GetMessagesParams, params: RequestParams = {}) =>
      this.request<GetMessagesData, Error>({
        path: `/messages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Message
     * @name PostMessages
     * @request POST:/messages
     * @secure
     */
    postMessages: (data: MessageRequest, params: RequestParams = {}) =>
      this.request<PostMessagesData, Error>({
        path: `/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Message
     * @name GetMessagesId
     * @request GET:/messages/{id}
     * @secure
     */
    getMessagesId: (
      { id, ...query }: GetMessagesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetMessagesIdData, Error>({
        path: `/messages/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Message
     * @name PutMessagesId
     * @request PUT:/messages/{id}
     * @secure
     */
    putMessagesId: (
      { id, ...query }: PutMessagesIdParams,
      data: MessageRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutMessagesIdData, Error>({
        path: `/messages/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Message
     * @name DeleteMessagesId
     * @request DELETE:/messages/{id}
     * @secure
     */
    deleteMessagesId: (
      { id, ...query }: DeleteMessagesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteMessagesIdData, Error>({
        path: `/messages/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  recording = {
    /**
     * No description
     *
     * @tags Recording
     * @name GetRecordings
     * @request GET:/recordings
     * @secure
     */
    getRecordings: (query: GetRecordingsParams, params: RequestParams = {}) =>
      this.request<GetRecordingsData, Error>({
        path: `/recordings`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recording
     * @name PostRecordings
     * @request POST:/recordings
     * @secure
     */
    postRecordings: (data: RecordingRequest, params: RequestParams = {}) =>
      this.request<PostRecordingsData, Error>({
        path: `/recordings`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recording
     * @name GetRecordingsId
     * @request GET:/recordings/{id}
     * @secure
     */
    getRecordingsId: (
      { id, ...query }: GetRecordingsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetRecordingsIdData, Error>({
        path: `/recordings/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recording
     * @name PutRecordingsId
     * @request PUT:/recordings/{id}
     * @secure
     */
    putRecordingsId: (
      { id, ...query }: PutRecordingsIdParams,
      data: RecordingRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutRecordingsIdData, Error>({
        path: `/recordings/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recording
     * @name DeleteRecordingsId
     * @request DELETE:/recordings/{id}
     * @secure
     */
    deleteRecordingsId: (
      { id, ...query }: DeleteRecordingsIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteRecordingsIdData, Error>({
        path: `/recordings/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recording
     * @name BrowseRecordings
     * @summary Browse recordings with scope filtering (auth required)
     * @request GET:/recordings/browse
     * @secure
     */
    browseRecordings: (
      query: BrowseRecordingsParams,
      params: RequestParams = {},
    ) =>
      this.request<BrowseRecordingsData, Error | void>({
        path: `/recordings/browse`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  source = {
    /**
     * No description
     *
     * @tags Source
     * @name GetSources
     * @request GET:/sources
     * @secure
     */
    getSources: (query: GetSourcesParams, params: RequestParams = {}) =>
      this.request<GetSourcesData, Error>({
        path: `/sources`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Source
     * @name PostSources
     * @request POST:/sources
     * @secure
     */
    postSources: (data: SourceRequest, params: RequestParams = {}) =>
      this.request<PostSourcesData, Error>({
        path: `/sources`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Source
     * @name GetSourcesId
     * @request GET:/sources/{id}
     * @secure
     */
    getSourcesId: (
      { id, ...query }: GetSourcesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<GetSourcesIdData, Error>({
        path: `/sources/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Source
     * @name PutSourcesId
     * @request PUT:/sources/{id}
     * @secure
     */
    putSourcesId: (
      { id, ...query }: PutSourcesIdParams,
      data: SourceRequest,
      params: RequestParams = {},
    ) =>
      this.request<PutSourcesIdData, Error>({
        path: `/sources/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Source
     * @name DeleteSourcesId
     * @request DELETE:/sources/{id}
     * @secure
     */
    deleteSourcesId: (
      { id, ...query }: DeleteSourcesIdParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteSourcesIdData, Error>({
        path: `/sources/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  uploadFile = {
    /**
     * @description Upload files
     *
     * @tags Upload - File
     * @name UploadCreate
     * @request POST:/upload
     * @secure
     */
    uploadCreate: (data: UploadCreatePayload, params: RequestParams = {}) =>
      this.request<UploadCreateData, any>({
        path: `/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload file information
     *
     * @tags Upload - File
     * @name UploadIdCreate
     * @request POST:/upload?id={id}
     * @secure
     */
    uploadIdCreate: (
      { id, ...query }: UploadIdCreateParams,
      data: UploadIdCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<UploadIdCreateData, any>({
        path: `/upload?id=${id}`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name FilesList
     * @request GET:/upload/files
     * @secure
     */
    filesList: (params: RequestParams = {}) =>
      this.request<FilesListData, any>({
        path: `/upload/files`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name FilesDetail
     * @request GET:/upload/files/{id}
     * @secure
     */
    filesDetail: (
      { id, ...query }: FilesDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<FilesDetailData, any>({
        path: `/upload/files/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name FilesDelete
     * @request DELETE:/upload/files/{id}
     * @secure
     */
    filesDelete: (
      { id, ...query }: FilesDeleteParams,
      params: RequestParams = {},
    ) =>
      this.request<FilesDeleteData, any>({
        path: `/upload/files/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  usersPermissionsAuth = {
    /**
     * @description Redirects to provider login before being redirect to /auth/{provider}/callback
     *
     * @tags Users-Permissions - Auth
     * @name ConnectDetail
     * @summary Login with a provider
     * @request GET:/connect/{provider}
     * @secure
     */
    connectDetail: (
      { provider, ...query }: ConnectDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<any, void | Error>({
        path: `/connect/${provider}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a jwt token and user info
     *
     * @tags Users-Permissions - Auth
     * @name LocalCreate
     * @summary Local login
     * @request POST:/auth/local
     * @secure
     */
    localCreate: (data: LocalCreatePayload, params: RequestParams = {}) =>
      this.request<LocalCreateData, Error>({
        path: `/auth/local`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a jwt token and user info
     *
     * @tags Users-Permissions - Auth
     * @name LocalRegisterCreate
     * @summary Register a user
     * @request POST:/auth/local/register
     * @secure
     */
    localRegisterCreate: (
      data: LocalRegisterCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<LocalRegisterCreateData, Error>({
        path: `/auth/local/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name CallbackList
     * @summary Default Callback from provider auth
     * @request GET:/auth/{provider}/callback
     * @secure
     */
    callbackList: (
      { provider, ...query }: CallbackListParams,
      params: RequestParams = {},
    ) =>
      this.request<CallbackListData, Error>({
        path: `/auth/${provider}/callback`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name ForgotPasswordCreate
     * @summary Send rest password email
     * @request POST:/auth/forgot-password
     * @secure
     */
    forgotPasswordCreate: (
      data: ForgotPasswordCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<ForgotPasswordCreateData, Error>({
        path: `/auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name ResetPasswordCreate
     * @summary Rest user password
     * @request POST:/auth/reset-password
     * @secure
     */
    resetPasswordCreate: (
      data: ResetPasswordCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<ResetPasswordCreateData, Error>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name ChangePasswordCreate
     * @summary Update user's own password
     * @request POST:/auth/change-password
     * @secure
     */
    changePasswordCreate: (
      data: ChangePasswordCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<ChangePasswordCreateData, Error>({
        path: `/auth/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name EmailConfirmationList
     * @summary Confirm user email
     * @request GET:/auth/email-confirmation
     * @secure
     */
    emailConfirmationList: (
      query: EmailConfirmationListParams,
      params: RequestParams = {},
    ) =>
      this.request<any, void | Error>({
        path: `/auth/email-confirmation`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name SendEmailConfirmationCreate
     * @summary Send confirmation email
     * @request POST:/auth/send-email-confirmation
     * @secure
     */
    sendEmailConfirmationCreate: (
      data: SendEmailConfirmationCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<SendEmailConfirmationCreateData, Error>({
        path: `/auth/send-email-confirmation`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  usersPermissionsUsersRoles = {
    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name PermissionsList
     * @summary Get default generated permissions
     * @request GET:/users-permissions/permissions
     * @secure
     */
    permissionsList: (params: RequestParams = {}) =>
      this.request<PermissionsListData, Error>({
        path: `/users-permissions/permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesList
     * @summary List roles
     * @request GET:/users-permissions/roles
     * @secure
     */
    rolesList: (params: RequestParams = {}) =>
      this.request<RolesListData, Error>({
        path: `/users-permissions/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesCreate
     * @summary Create a role
     * @request POST:/users-permissions/roles
     * @secure
     */
    rolesCreate: (
      data: {
        name?: string;
        description?: string;
        type?: string;
        permissions?: UsersPermissionsPermissionsTree;
      },
      params: RequestParams = {},
    ) =>
      this.request<RolesCreateData, Error>({
        path: `/users-permissions/roles`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesDetail
     * @summary Get a role
     * @request GET:/users-permissions/roles/{id}
     * @secure
     */
    rolesDetail: (
      { id, ...query }: RolesDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<RolesDetailData, Error>({
        path: `/users-permissions/roles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesUpdate
     * @summary Update a role
     * @request PUT:/users-permissions/roles/{role}
     * @secure
     */
    rolesUpdate: (
      { role, ...query }: RolesUpdateParams,
      data: {
        name?: string;
        description?: string;
        type?: string;
        permissions?: UsersPermissionsPermissionsTree;
      },
      params: RequestParams = {},
    ) =>
      this.request<RolesUpdateData, Error>({
        path: `/users-permissions/roles/${role}`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesDelete
     * @summary Delete a role
     * @request DELETE:/users-permissions/roles/{role}
     * @secure
     */
    rolesDelete: (
      { role, ...query }: RolesDeleteParams,
      params: RequestParams = {},
    ) =>
      this.request<RolesDeleteData, Error>({
        path: `/users-permissions/roles/${role}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersList
     * @summary Get list of users
     * @request GET:/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<UsersListData, Error>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersCreate
     * @summary Create a user
     * @request POST:/users
     * @secure
     */
    usersCreate: (data: UsersCreatePayload, params: RequestParams = {}) =>
      this.request<UsersCreateData, Error>({
        path: `/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersDetail
     * @summary Get a user
     * @request GET:/users/{id}
     * @secure
     */
    usersDetail: (
      { id, ...query }: UsersDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<UsersDetailData, Error>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersUpdate
     * @summary Update a user
     * @request PUT:/users/{id}
     * @secure
     */
    usersUpdate: (
      { id, ...query }: UsersUpdateParams,
      data: UsersUpdatePayload,
      params: RequestParams = {},
    ) =>
      this.request<UsersUpdateData, Error>({
        path: `/users/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersDelete
     * @summary Delete a user
     * @request DELETE:/users/{id}
     * @secure
     */
    usersDelete: (
      { id, ...query }: UsersDeleteParams,
      params: RequestParams = {},
    ) =>
      this.request<UsersDeleteData, Error>({
        path: `/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name GetUsersPermissionsUsersRoles
     * @summary Get authenticated user info
     * @request GET:/users/me
     * @secure
     */
    getUsersPermissionsUsersRoles: (
      query: GetUsersPermissionsUsersRolesParams,
      params: RequestParams = {},
    ) =>
      this.request<GetUsersPermissionsUsersRolesData, Error>({
        path: `/users/me`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name CountList
     * @summary Get user count
     * @request GET:/users/count
     * @secure
     */
    countList: (params: RequestParams = {}) =>
      this.request<CountListData, Error>({
        path: `/users/count`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
