import Singleton from "../patterns/Singleton";
import * as fs from "fs";
import * as path from "path";

class Logger extends Singleton {
  private logFilePath: string;

  constructor() {
    super();
    this.logFilePath = path.join(process.cwd(), "logs", "app.txt");
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(...args: unknown[]) {
    const logMessage = `[${new Date().toLocaleString()}] ${args.join(" ")}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
  }
}

export default Logger;
