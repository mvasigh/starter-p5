import { fileURLToPath } from "url";
import { dirname } from "path";
import * as dotenv from "dotenv";
import osc from "osc";
import WebSocket from "ws";
import express from "express";

dotenv.config();

const { OSC_PORT, WS_PORT, STATIC_PORT, VERBOSE_LOGS } = process.env;

function createStaticServer() {
  const staticPath = dirname(fileURLToPath(import.meta.url)) + "/dist";
  const port = STATIC_PORT ?? 8081;
  const app = express();

  app.use("/", express.static(staticPath));

  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`    Started static server at: http://localhost:${port}`);
      resolve(app);
    });
  });
}

function createWsServer() {
  const port = WS_PORT ?? 8080;
  const wsServer = new WebSocket.Server({ port });

  console.log(`    Started WS server at: ws://localhost:${port}`);
  return Promise.resolve(wsServer);
}

function createOscServer() {
  const localPort = OSC_PORT ?? 57121;
  const oscServer = new osc.UDPPort({
    localPort,
    localAddress: "0.0.0.0",
    metadata: true,
  });
  return new Promise((resolve) => {
    oscServer.on("ready", () => {
      console.log(`    Started OSC server at: http://localhost:${localPort}`);
      resolve(oscServer);
    });
    oscServer.open();
  });
}

console.log(`🌈  Starting the server...`);
await createStaticServer();
const wss = await createWsServer();
const oscs = await createOscServer();

oscs.on("message", (oscMsg, timeTag, info) => {
  if (VERBOSE_LOGS) {
    console.log({ oscMsg, timeTag, info });
  }

  wss.clients.forEach((client) => {
    client.send({
      oscMsg,
      timeTag,
      info,
    });
  });
});
