import { useEffect, useRef } from "preact/hooks";
import p5 from "p5";
import sketch from "./sketch";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:1234";

export default () => {
  const sketchRef = useRef();

  useEffect(() => {
    const drawing = new p5(sketch, sketchRef.current);

    if (!drawing.onmessage) return;

    const socket = new WebSocket(WS_URL);
    socket.addEventListener("message", (event) => {
      drawing.onmessage(event);
    });

    return () => {
      socket.close();
    }
  }, []);

  return <div id="p5-sketch" ref={sketchRef} />;
};
