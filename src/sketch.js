import p5 from "p5";

const WIDTH = 720;
const HEIGHT = 720;

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = 1;
    this.opacity = 255;
  }

  update() {
    this.d += 0.55;
    this.opacity -= 1;
  }

  /** @type {(p: p5) => void} */
  draw(p) {
    p.stroke(232, this.opacity);
    p.circle(this.x, this.y, this.d);
  }
}

/** @type {(p: p5) => void} */
export default (p) => {
  /** @type {Set<Ripple>} */
  const ripples = new Set();

  /**
   * Runs once at the beginning of the sketch.
   */
  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    p.background(22, 33, 88);
  };

  /**
   * Runs once for each frame
   */
  p.draw = () => {
    p.noStroke();
    p.fill(22, 33, 88, 50);
    p.rect(0, 0, WIDTH, HEIGHT);
    
    p.noFill();
    p.strokeWeight(1);
    ripples.forEach(ripple => {
      ripple.update();
      ripple.draw(p);

      if (ripple.opacity <= 0) {
        ripples.delete(ripple);
      }
    })
  };

  /**
   * Runs when an OSC message is received
   */
  p.onmessage = (event) => {
    const x = p.random(0, WIDTH);
    const y = p.random(0, HEIGHT);
    const ripple = new Ripple(x, y);
    ripples.add(ripple);
  };
};
