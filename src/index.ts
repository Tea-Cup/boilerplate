import { argv, exit } from "process";
import fs from "fs";
import p from "path";
import { TemplateInfo } from "./types";
import cli from "./cli";
import defaults from "./config";
import * as rl from "./readline";

const [, basePath, ...args] = argv;

function readTemplate(name: string) {
  const path = p.join(basePath, "templates", name);
  const jsonPath = p.join(path, "template.json");
  if (!fs.existsSync(path) || !fs.existsSync(jsonPath)) return null;
  const file = fs.readFileSync(jsonPath, "utf8");
  const info = JSON.parse(file) as TemplateInfo;
  info.path = path;
  return info;
}

function recursiveCopy(from: string, to: string) {
  const statFrom = fs.statSync(from);
  const statTo = fs.statSync(to, { throwIfNoEntry: false });
  if (statFrom.isDirectory()) {
    cli.normal('Copying ').yellow(p.basename(from)+'/').log();
    if(!statTo) {
      fs.mkdirSync(to);
    } else if (!statTo.isDirectory()) {
      fs.rmSync(to);
      fs.mkdirSync(to);
    }
    for (const f of fs.readdirSync(from)) {
      const filename = p.basename(f);
      recursiveCopy(p.join(from, filename), p.join(to, filename));
    }
  } else {
    cli.normal('Copying ').yellow(p.basename(from)).log();
    if (statTo && statTo.isDirectory()) fs.rmdirSync(to);
    fs.copyFileSync(from, to);
  }
}

async function run() {
  const folders = fs.readdirSync(p.join(basePath, "templates"));

  if (args.length === 0 || args.includes("--list")) {
    for (const f of folders) {
      const info = readTemplate(f);
      if (info) {
        cli.cyan("%s").normal(": %s").log(f, info.description);
      } else {
        cli.cyan("%s").normal(": ").red("Invalid template").log(f);
      }
    }
    return;
  }

  const name = args[0];
  const info = readTemplate(name);
  if (!info) {
    cli.cyan("%s").normal(": ").red("Invalid template").log(name);
    return;
  }

  cli.cyan("%s").normal(": %s").log(name, info.description);
  const targetPath = p.resolve(await rl.question("Enter directory path", "."));

  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory()) {
      if (fs.readdirSync(targetPath).length > 0) {
        const answer = await rl.prompt(
          "Target directory is not empty. Continue anyway?"
        );
        if (!answer) return;
      }
    } else {
      const answer = await rl.prompt(
        "Target is a file. Delete it and create a directory?"
      );
      if (answer) {
        fs.rmSync(targetPath);
      } else {
        return;
      }
    }
  }

  const targetName = await rl.question(
    "Enter package name",
    p.basename(targetPath)
  );

  for (const cfgName in info.config) {
    console.log("Generating", cfgName);
    const cfg = info.config[cfgName];
    let value = "";
    if (cfgName === "package.json") {
      const pkg = <any>{
        name: targetName,
        ...defaults["package.json"],
        ...cfg,
      };
      delete pkg.type;
      value = JSON.stringify(pkg, undefined, 2);
    } else if (cfg.type === "json") {
      value = JSON.stringify(cfg.root, undefined, 2);
    } else {
      cli.red("Unknown config type: ").normal(cfg.type).log();
      return;
    }
    fs.writeFileSync(p.join(targetPath, cfgName), value, "utf8");
  }

  const fsPath = p.join(info.path, "fs");
  if (fs.statSync(fsPath).isDirectory()) {
    recursiveCopy(fsPath, targetPath);
  }

  exit(0);
}
run();
