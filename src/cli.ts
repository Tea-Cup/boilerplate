const esc = '\x1B';
const csi = `${esc}[`;
const sgr = (n: number) => `${csi}${n}m`;

const reset = 0;
const fg = 30;
const bg = fg + 10;
const bright = 60;
enum Colors {
  Black,
  Red,
  Green,
  Yellow,
  Blue,
  Magenta,
  Cyan,
  White
}

class CLI {
  private _text = '';
  get text() {
    return this._text;
  }

  private mod(s: string, n: number) {
    this._text += sgr(n) + s + sgr(reset);
    return this;
  }

  log(...params: string[]) {
    console.log(this.text, ...params);
    this._text = '';
  }

  normal(s: string) {
    this._text += s;
    return this;
  }

  black(s: string) {
    return this.mod(s, fg + Colors.Black);
  }
  red(s: string) {
    return this.mod(s, fg + Colors.Red);
  }
  green(s: string) {
    return this.mod(s, fg + Colors.Green);
  }
  yellow(s: string) {
    return this.mod(s, fg + Colors.Yellow);
  }
  blue(s: string) {
    return this.mod(s, fg + Colors.Blue);
  }
  magenta(s: string) {
    return this.mod(s, fg + Colors.Magenta);
  }
  cyan(s: string) {
    return this.mod(s, fg + Colors.Cyan);
  }
  
  blackBright(s: string) {
    return this.mod(s, fg + bright + Colors.Black);
  }
  redBright(s: string) {
    return this.mod(s, fg + bright + Colors.Red);
  }
  greenBright(s: string) {
    return this.mod(s, fg + bright + Colors.Green);
  }
  yellowBright(s: string) {
    return this.mod(s, fg + bright + Colors.Yellow);
  }
  blueBright(s: string) {
    return this.mod(s, fg + bright + Colors.Blue);
  }
  magentaBright(s: string) {
    return this.mod(s, fg + bright + Colors.Magenta);
  }
  cyanBright(s: string) {
    return this.mod(s, fg + bright + Colors.Cyan);
  }
}

const cli = new CLI();
export default cli;