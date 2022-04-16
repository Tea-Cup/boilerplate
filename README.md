# Boilerplate
Generate boilerplate configs and file structure using one console command.

## Commands
* \<no arguments> - same as `--list`.
* `--list` - show list of found templates.
* \<template name> - spawn specified template.

## Template spawning
The tool will prompt you for a target directory and package name. By default it uses current working directory.
  
If target directory exists and not empty, you will be prompted to continue.

If target path is a file, you will be prompted to delete the file and create directory instead.

## Template creation
Templates are searched in `templates` directory. Each template is a directory. Directory name is equal to template name.

Inside, there are `template.json` file and an optional `fs` directory.

`fs` directory contains template files that are copied as-is to the target directory.

`template.json` contains template metadata and config files generation info.

`template.json` structure:  
```json
{
  "description": "Template description",
  "config": {...}
}
```

`config` key can be empty but must be present.

`config` object keys are equal to target filename. For example:
```json
{
  "config": {
    "package.json": {
      "main": "index.js"
    }
  }
}
```

`config` object values specify config generation options. Currently available ones:
* When filename == `package.json` it is considered a package file. It's values are pasted into target package file.  
Supported keys are: `version`, `main`, `license`, `scripts`, `dependencies`, `devDependencies`.
* When value `type` == `json` it is considered a simple JSON file. You can specify it's contents using `root` field.

Default `package.json` contents:
```json
{
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```
      
