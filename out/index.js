"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cli_1 = __importDefault(require("./cli"));
const config_1 = __importDefault(require("./config"));
const rl = __importStar(require("./readline"));
const [, basePath, ...args] = process_1.argv;
function readTemplate(name) {
    const path = path_1.default.join(basePath, "templates", name);
    const jsonPath = path_1.default.join(path, "template.json");
    if (!fs_1.default.existsSync(path) || !fs_1.default.existsSync(jsonPath))
        return null;
    const file = fs_1.default.readFileSync(jsonPath, "utf8");
    const info = JSON.parse(file);
    info.path = path;
    return info;
}
function recursiveCopy(from, to) {
    const statFrom = fs_1.default.statSync(from);
    const statTo = fs_1.default.statSync(to, { throwIfNoEntry: false });
    if (statFrom.isDirectory()) {
        cli_1.default
            .normal("Copying ")
            .yellow(path_1.default.basename(from) + "/")
            .log();
        if (!statTo) {
            fs_1.default.mkdirSync(to);
        }
        else if (!statTo.isDirectory()) {
            fs_1.default.rmSync(to);
            fs_1.default.mkdirSync(to);
        }
        for (const f of fs_1.default.readdirSync(from)) {
            const filename = path_1.default.basename(f);
            recursiveCopy(path_1.default.join(from, filename), path_1.default.join(to, filename));
        }
    }
    else {
        cli_1.default.normal("Copying ").yellow(path_1.default.basename(from)).log();
        if (statTo && statTo.isDirectory())
            fs_1.default.rmdirSync(to);
        fs_1.default.copyFileSync(from, to);
    }
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const folders = fs_1.default.readdirSync(path_1.default.join(basePath, "templates"));
        if (args.length === 0 || args.includes("--list")) {
            for (const f of folders) {
                const info = readTemplate(f);
                if (info) {
                    cli_1.default.cyan("%s").normal(": %s").log(f, info.description);
                }
                else {
                    cli_1.default.cyan("%s").normal(": ").red("Invalid template").log(f);
                }
            }
            return;
        }
        const name = args[0];
        const info = readTemplate(name);
        if (!info) {
            cli_1.default.cyan("%s").normal(": ").red("Invalid template").log(name);
            return;
        }
        cli_1.default.cyan("%s").normal(": %s").log(name, info.description);
        const targetPath = path_1.default.resolve(yield rl.question("Enter directory path", "."));
        if (fs_1.default.existsSync(targetPath)) {
            if (fs_1.default.statSync(targetPath).isDirectory()) {
                if (fs_1.default.readdirSync(targetPath).length > 0) {
                    const answer = yield rl.prompt("Target directory is not empty. Continue anyway?");
                    if (!answer)
                        return;
                }
            }
            else {
                const answer = yield rl.prompt("Target is a file. Delete it and create a directory?");
                if (answer) {
                    fs_1.default.rmSync(targetPath);
                }
                else {
                    return;
                }
            }
        }
        const targetName = yield rl.question("Enter package name", path_1.default.basename(targetPath));
        for (const cfgName in info.config) {
            console.log("Generating", cfgName);
            const cfg = info.config[cfgName];
            let value = "";
            if (cfgName === "package.json") {
                const pkg = Object.assign(Object.assign({ name: targetName }, config_1.default["package.json"]), cfg);
                delete pkg.type;
                value = JSON.stringify(pkg, undefined, 2);
            }
            else if (cfg.type === "json") {
                value = JSON.stringify(cfg.root, undefined, 2);
            }
            else if (cfg.type === "txt") {
                value = cfg.lines.join("\n");
            }
            else {
                cli_1.default.red("Unknown config type: ").normal(cfg.type).log();
                return;
            }
            fs_1.default.writeFileSync(path_1.default.join(targetPath, cfgName), value, "utf8");
        }
        const fsPath = path_1.default.join(info.path, "fs");
        if (fs_1.default.statSync(fsPath).isDirectory()) {
            recursiveCopy(fsPath, targetPath);
        }
        (0, process_1.exit)(0);
    });
}
run();
