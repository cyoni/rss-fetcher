import express from "express";
import cron from "node-cron";
import RssHandlerFactory from "./services/RssHandlerFactory";
import Logger from "./services/Logger";
import dotenv from "dotenv";

dotenv.config();

import { RSS_CONFIGS } from "./config";

const app = express();
const port = process.env.PORT || 3000;

const logger = new Logger();

const rssHandlers = RSS_CONFIGS.map((config) => {
  const handler = RssHandlerFactory.createHandler(
    config.url!,
    config.handlerType
  );

  return handler;
});

cron.schedule("*/10 * * * * *", () => {
  logger.log("Scheduled check executed.");

  rssHandlers.forEach(async (handler) => {
    const entry = await handler.fetchRssContent();
    await handler.processEntry(entry);
    await handler.sendNotification(entry);
  });
});

app.listen(port, () => {
  logger.log(`Server running at http://localhost:${port}`);
});
