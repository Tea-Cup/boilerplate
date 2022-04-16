import { stdin, stdout } from "process";
import * as readline from "readline";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

export async function question(query: string, defaultAnswer?: string) {
  const answer = await new Promise<string>((resolve, reject) => {
    if (defaultAnswer !== undefined){
      query += ` ('${defaultAnswer}')`;
    }
    rl.question(query + ": ", (answer) => resolve(answer));
  });
  if(!answer && defaultAnswer !== undefined) return defaultAnswer;
  return answer;
}

export async function prompt(query: string, defaultYes = false) {
  const options = defaultYes ? "(Y/n)" : "(y/N)";
  const answer = await question(`${query} ${options}`);
  return answer.toLowerCase()[0] === "y";
}
