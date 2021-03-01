import { useEffect, useRef } from "preact/hooks";
import p5 from "p5";
import sketch from './sketch'

export default () => {
  const sketchRef = useRef();

  useEffect(() => {
    new p5(sketch, sketchRef.current);
  }, []);

  return <div id="p5-sketch" ref={sketchRef} />;
};
