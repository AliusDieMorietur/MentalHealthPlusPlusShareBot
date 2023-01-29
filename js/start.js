require("dotenv").config();

const Application = require("./domain/application");

const { TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN, REQUEST_TIMEOUT, SERVER_URL } =
  process.env;

const app = new Application({
  server: {
    protocol: "http",
    port: 3000,
    hostname: "127.0.0.1",
  },
  channel: {
    serverUrl: SERVER_URL,
    timeout: REQUEST_TIMEOUT,
  },
  channels: [
    {
      name: "telegram",
      config: {
        apiUrl: TELEGRAM_API_URL,
        token: TELEGRAM_BOT_TOKEN,
      },
    },
  ],
});

app.start();
