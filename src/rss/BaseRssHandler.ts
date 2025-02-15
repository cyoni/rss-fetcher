import Logger from "../services/Logger";

abstract class BaseRssHandler<T> {
  protected logger = new Logger();
  protected secRssUrl: string;

  constructor(secRssUrl: string) {
    this.secRssUrl = secRssUrl;
  }

  abstract fetchRssContent(): Promise<any>;
  abstract processEntry(entry: T): Promise<any>;
  abstract sendNotification(entry: T): Promise<void>;
}

export default BaseRssHandler;
