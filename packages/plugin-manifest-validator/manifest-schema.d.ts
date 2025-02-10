/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * @maxItems 30
 */
export type Resources = string[];

export interface KintonePluginManifestJson {
  $schema?: string;
  manifest_version: number;
  version: number | string;
  type: "APP";
  name: {
    ja?: string;
    en: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    th?: string;
    "pt-BR"?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    th?: string;
    "pt-BR"?: string;
  };
  /**
   * internal only
   */
  icon: string;
  homepage_url?: {
    ja?: string;
    en?: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    th?: string;
    "pt-BR"?: string;
  };
  desktop?: {
    js?: Resources;
    css?: Resources;
  };
  mobile?: {
    js?: Resources;
    css?: Resources;
  };
  config?: {
    /**
     * internal only
     */
    html?: string;
    js?: Resources;
    css?: Resources;
    required_params?: string[];
  };
}
