import EmailNotifier from "../notifiers/EmailNotifier";
import TelegramNotifier from "../notifiers/TelegramNotifier";

class NotifierFactory {
  static createNotifier(type: string) {
    switch (type) {
      case "email":
        return new EmailNotifier();
      case "telegram":
        return new TelegramNotifier();
      default:
        throw new Error(`Unknown notifier type: ${type}`);
    }
  }
}

export default NotifierFactory;
