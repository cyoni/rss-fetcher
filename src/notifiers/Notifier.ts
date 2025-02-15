import Logger from "../services/Logger";

abstract class Notifier {
  protected logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  abstract sendNotification(
    subject: string,
    textPart: string,
    body: string
  ): void;
}

export default Notifier;
