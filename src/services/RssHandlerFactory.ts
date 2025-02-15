import StockRssHandler from "../rss/StockRssHandler";

class RssHandlerFactory {
  static createHandler(url: string, type: string) {
    switch (type) {
      case "stock":
        return new StockRssHandler(url);
      default:
        throw new Error(`Unsupported handler type: ${type}`);
    }
  }
}

export default RssHandlerFactory;
