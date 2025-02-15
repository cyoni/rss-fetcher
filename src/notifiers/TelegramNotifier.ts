import Notifier from "./Notifier";
import TelegramBot from "node-telegram-bot-api";

class TelegramNotifier extends Notifier {
  private bot: TelegramBot;

  constructor() {
    super();
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);
  }

  async sendNotification(message: string) {
    await this.bot.sendMessage(process.env.TELEGRAM_CHAT_ID!, message);
  }
}

export default TelegramNotifier;
