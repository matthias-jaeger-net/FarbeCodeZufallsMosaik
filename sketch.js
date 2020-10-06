// FarbeCodeZufallsMosaik

let tool = "";
function setTool(type) {
  tool = type;
}
const TILE_SIZE = 200;
let tiles = [];
let imagePool = [];
let mosaik, colorPicker;

class Tile {
  constructor(x, y, p) {
    this.pos = p.createVector(x, y);
    this.buffer = p.createGraphics(TILE_SIZE, TILE_SIZE);
    this.buffer.background(255);
    this.p = p;
  }
  render() {
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);
    this.p.image(this.buffer, 0, 0);
    this.p.pop();
  }
  isMouseOver(x, y) {
    return x > this.pos.x &&
      x < this.pos.x + this.buffer.width &&
      y > this.pos.y &&
      y < this.pos.y + this.buffer.height
  }
}

// Editor
new p5((p) => {

  "use strict";

  p.preload = () => {
    colorPicker = p.createColorPicker("#FFFFFF");
    colorPicker.parent(p.select("#editor"));
  };

  p.setup = () => {
    p.createCanvas(400, 400);
    p.background("#EEEEEE")
    tiles.push(new Tile(0, 0, p));
    tiles.push(new Tile(TILE_SIZE, 0, p));
    tiles.push(new Tile(TILE_SIZE, TILE_SIZE, p));
    tiles.push(new Tile(0, TILE_SIZE, p));
  };

  window.generate = () => {
    for (let t of tiles) imagePool.push(t.buffer);
    mosaik = p.createGraphics(TILE_SIZE * 4, TILE_SIZE * 4)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let x = i * TILE_SIZE;
        let y = j * TILE_SIZE;
        mosaik.image(p.random(imagePool), x, y);
      }
    }
  }

  p.draw = () => {
    for (let t of tiles) {
      t.render();
      if (t.isMouseOver(p.mouseX, p.mouseY) && p.mouseIsPressed) {
        const rx = p.mouseX - t.pos.x;
        const ry = p.mouseY - t.pos.y;
        const rxp = p.pmouseX - t.pos.x;
        const ryp = p.pmouseY - t.pos.y;
        const c = colorPicker.color();

        if (tool === "pen") {
          t.buffer.stroke(c);
          t.buffer.strokeWeight(3);
          t.buffer.line(rx, ry, rxp, ryp);
        }

        if (tool === "brush") {
          t.buffer.noStroke();
          t.buffer.fill(p.red(c), p.green(c), p.blue(c), 200)
          t.buffer.circle(rx, ry, 30 * p.noise(p.frameCount / 100));
        }

        if (tool === "spraypaint") {
          t.buffer.noStroke();
          t.buffer.fill(p.red(c), p.green(c), p.blue(c), 100)
          for (let i = 0; i < 300; i++) {
            const v1 = p.createVector(rx, ry);
            const v2 = p5.Vector.random2D().mult(p.random(30));
            v1.add(v2);
            t.buffer.circle(v1.x, v1.y, p.random(3));
          }
        }
      }
    }
  };
}, "editor");


// Generator
new p5((p) => {
  "use strict";
  p.setup = () => {
    p.createCanvas(800, 800);
  };
  p.draw = () => {
    if (mosaik) p.image(mosaik, 0, 0)
  };
}, "generator");
