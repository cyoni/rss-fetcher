import Notifier from "./Notifier";
import Logger from "../services/Logger";
import axios, { AxiosError } from "axios";
import base64 from "base-64";

class EmailNotifier extends Notifier {
  private MAILJET_API_KEY: string = process.env.MAILJET_API_KEY!;
  private MAILJET_API_SECRET: string = process.env.MAILJET_API_SECRET!;

  private payload = {
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_FROM_EMAIL!,
          Name: "My Alert System",
        },
        To: [
          {
            Email: process.env.MAILJET_TO_EMAIL!,
            Name: "You",
          },
        ],
        Subject: "",
        TextPart: "",
        HTMLPart: "",
      },
    ],
  };

  constructor() {
    super();
    this.logger = new Logger();
  }

  async sendNotification(subject: string, textPart: string, htmlPart: string) {
    try {
      this.payload.Messages[0].Subject = subject;
      this.payload.Messages[0].TextPart = textPart;
      this.payload.Messages[0].HTMLPart = htmlPart;

      const response = await axios.post(
        "https://api.mailjet.com/v3.1/send",
        this.payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              base64.encode(
                `${this.MAILJET_API_KEY}:${this.MAILJET_API_SECRET}`
              ),
          },
        }
      );

      this.logger.log("Email sent successfully:", response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        this.logger.log("Error Response:", error.response.data);
      } else if (error instanceof Error) {
        this.logger.log("Error:", error.message);
      }
    }
  }
}

export default EmailNotifier;
