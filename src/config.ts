import { TemplateConfig, TemplatePackageJson } from "./types";

const defaults = {
  'package.json': <TemplatePackageJson>{
    type: 'package.json',
    version: '1.0.0',
    main: 'index.js',
    license: 'MIT'
  }
}
export default defaults;