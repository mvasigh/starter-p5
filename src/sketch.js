import p5 from 'p5'

const WIDTH = 720;
const HEIGHT = 720;

/** @type {(p: p5) => void} */
export default (p) => {
  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    p.background(0);
  };

  p.draw = () => {
    p.stroke(255);
    p.strokeWeight(1);
    p.noFill();
    p.circle(WIDTH / 2, HEIGHT / 2, 200);
    p.circle(WIDTH / 2, HEIGHT / 2, 180);
    p.circle(WIDTH / 2, HEIGHT / 2, 160);
  };
};
