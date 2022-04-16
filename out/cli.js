"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esc = '\x1B';
const csi = `${esc}[`;
const sgr = (n) => `${csi}${n}m`;
const reset = 0;
const fg = 30;
const bg = fg + 10;
const bright = 60;
var Colors;
(function (Colors) {
    Colors[Colors["Black"] = 0] = "Black";
    Colors[Colors["Red"] = 1] = "Red";
    Colors[Colors["Green"] = 2] = "Green";
    Colors[Colors["Yellow"] = 3] = "Yellow";
    Colors[Colors["Blue"] = 4] = "Blue";
    Colors[Colors["Magenta"] = 5] = "Magenta";
    Colors[Colors["Cyan"] = 6] = "Cyan";
    Colors[Colors["White"] = 7] = "White";
})(Colors || (Colors = {}));
class CLI {
    constructor() {
        this._text = '';
    }
    get text() {
        return this._text;
    }
    mod(s, n) {
        this._text += sgr(n) + s + sgr(reset);
        return this;
    }
    log(...params) {
        console.log(this.text, ...params);
        this._text = '';
    }
    normal(s) {
        this._text += s;
        return this;
    }
    black(s) {
        return this.mod(s, fg + Colors.Black);
    }
    red(s) {
        return this.mod(s, fg + Colors.Red);
    }
    green(s) {
        return this.mod(s, fg + Colors.Green);
    }
    yellow(s) {
        return this.mod(s, fg + Colors.Yellow);
    }
    blue(s) {
        return this.mod(s, fg + Colors.Blue);
    }
    magenta(s) {
        return this.mod(s, fg + Colors.Magenta);
    }
    cyan(s) {
        return this.mod(s, fg + Colors.Cyan);
    }
    blackBright(s) {
        return this.mod(s, fg + bright + Colors.Black);
    }
    redBright(s) {
        return this.mod(s, fg + bright + Colors.Red);
    }
    greenBright(s) {
        return this.mod(s, fg + bright + Colors.Green);
    }
    yellowBright(s) {
        return this.mod(s, fg + bright + Colors.Yellow);
    }
    blueBright(s) {
        return this.mod(s, fg + bright + Colors.Blue);
    }
    magentaBright(s) {
        return this.mod(s, fg + bright + Colors.Magenta);
    }
    cyanBright(s) {
        return this.mod(s, fg + bright + Colors.Cyan);
    }
}
const cli = new CLI();
exports.default = cli;
