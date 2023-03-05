import dotenv from "dotenv";
dotenv.config();

import { Application } from "./lib/application.js";

const {
  TELEGRAM_BOT_TOKEN,
  REQUEST_TIMEOUT,
  SERVER_URL,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

const app = new Application({
  server: {
    protocol: "http",
    port: 8000,
    hostname: "127.0.0.1",
  },
  database: {
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    host: POSTGRES_HOST,
  },
  channel: {
    serverUrl: SERVER_URL,
    timeout: REQUEST_TIMEOUT,
  },
  channels: [
    {
      name: "telegram",
      config: {
        apiUrl: "https://api.telegram.org/bot",
        token: TELEGRAM_BOT_TOKEN,
      },
    },
  ],
});

app.start();
