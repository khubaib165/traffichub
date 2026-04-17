import * as functions from "firebase-functions";
import * as express from "express";
import * as next from "next";

const isDev = process.env.NODE_ENV !== "production";
const app = next({
  dev: isDev,
  conf: {
    distDir: ".next",
  },
});

const nextRequestHandler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Handle all requests with Next.js
  server.all("*", (req, res) => {
    return nextRequestHandler(req, res);
  });

  // Export as Firebase Function
  exports.api = functions.https.onRequest(server);
});
