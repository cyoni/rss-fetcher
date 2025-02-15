import axios from "axios";
import BaseRssHandler from "./BaseRssHandler";
import { parseStringPromise } from "xml2js";
import EmailNotifier from "../notifiers/EmailNotifier";
import { secEdgarEntity } from "../types";
import TelegramNotifier from "../notifiers/TelegramNotifier";

class StockRssHandler extends BaseRssHandler<secEdgarEntity> {
  private lastEntryId: string = "";
  private emailNotifier: EmailNotifier;
  private telegramNotifier: TelegramNotifier;

  constructor(secRssUrl: string) {
    super(secRssUrl);
    this.emailNotifier = new EmailNotifier();
    this.telegramNotifier = new TelegramNotifier();
  }

  async fetchRssContent() {
    try {
      const response = await axios.get(this.secRssUrl, {
        headers: {
          "User-Agent": "MyAppName/1.0 (contact@example.com)",
          Accept: "application/json, text/plain, */*",
        },
      });
      const parsed = await parseStringPromise(response.data, {
        explicitArray: false,
        mergeAttrs: true,
      });

      if (!parsed || !parsed.feed || !parsed.feed.entry) {
        this.logger.log("Invalid RSS feed format");
        return;
      }

      const entries: secEdgarEntity[] = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];

      const entry = entries[0];

      if (!this.lastEntryId) {
        this.lastEntryId = entry.id;
      }

      return entry;
    } catch (err) {
      this.logger.log(err);
    }
  }

  async processEntry(entry: secEdgarEntity | undefined) {
    if (!entry) {
      return;
    }

    if (entry.id === this.lastEntryId) {
      return;
    }

    return entry;
  }

  async sendNotification(entry: secEdgarEntity | undefined) {
    if (!entry) {
      return;
    }

    const subject = "Stock SEC Filing";
    const textPart = `Stock has filed a new SEC Filing: ${entry.id}`;
    const htmlPart = `
    <div>
      <p>Stock has filed a new SEC Filing: ${entry.link.href}</p> 
      <p>Updated: ${entry.updated}</p>
      <p>ID: ${entry.id}</p>
    </div>
    `;

    await this.emailNotifier.sendNotification(subject, textPart, htmlPart);

    await this.telegramNotifier
      .sendNotification(`Stock has filed a new SEC Filing: ${entry.link.href}\n
      id: ${entry.id}`);

    // next step:
    // send list of instruments
  }
}

export default StockRssHandler;
