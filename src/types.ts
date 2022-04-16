export interface TemplateConfigBase {
  type: string;
}
export interface TemplatePackageJson extends TemplateConfigBase {
  type: 'package.json';
  version: string;
  main: string;
  license: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
export interface TemplateConfigJson extends TemplateConfigBase {
  type: 'json';
  root: object;
}

export type TemplateConfig = TemplatePackageJson | TemplateConfigJson;
export interface TemplateInfo {
  path: string;
  description: string;
  config: Record<string, TemplateConfig>;
}