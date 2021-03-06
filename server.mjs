import osc from "osc";
import WebSocket from "ws";
import * as dotenv from "dotenv";

dotenv.config();

const { OSC_PORT, WS_PORT } = process.env;

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
const wss = await createWsServer();
const oscs = await createOscServer();

oscs.on("message", (oscMsg, timeTag, info) => {
  console.log(`Received a new OSC message!`);
  console.log({ oscMsg, timeTag, info });

  console.log(oscMsg.args);

  wss.clients.forEach((client) => {
    client.send("I got an OSC message");
  });
});

setInterval(() => {
  wss.clients.forEach(client => client.send(Date.now()))
}, 1000)
