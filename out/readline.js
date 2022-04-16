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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt = exports.question = void 0;
const process_1 = require("process");
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process_1.stdin,
    output: process_1.stdout,
});
function question(query, defaultAnswer) {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield new Promise((resolve, reject) => {
            if (defaultAnswer !== undefined) {
                query += ` ('${defaultAnswer}')`;
            }
            rl.question(query + ": ", (answer) => resolve(answer));
        });
        if (!answer && defaultAnswer !== undefined)
            return defaultAnswer;
        return answer;
    });
}
exports.question = question;
function prompt(query, defaultYes = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = defaultYes ? "(Y/n)" : "(y/N)";
        const answer = yield question(`${query} ${options}`);
        return answer.toLowerCase()[0] === "y";
    });
}
exports.prompt = prompt;
