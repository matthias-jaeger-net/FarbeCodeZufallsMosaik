// FarbeCodeZufallsMosaik

const TILE_SIZE = 200;
let TOOL = "pen";

const setTool = (type) => {
  TOOL = type;
}
let tiles = [];
let imagePool = [];
let mosaik, colorPicker;

// Editor
const editor = new p5((p) => {

  "use strict";

  p.preload = () => {
    colorPicker = p.createColorPicker("#000000");
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

  p.draw = () => {
    for (let t of tiles) {
      t.render();
      if (t.isMouseOver(p.mouseX, p.mouseY) && p.mouseIsPressed) {
        const rx = p.mouseX - t.pos.x;
        const ry = p.mouseY - t.pos.y;
        const rxp = p.pmouseX - t.pos.x;
        const ryp = p.pmouseY - t.pos.y;
        const c = colorPicker.color();

        if (TOOL === "pen") {
          document.getElementById("pen").classList.add("is-active")
          t.buffer.stroke(c);
          t.buffer.strokeWeight(3);
          t.buffer.line(rx, ry, rxp, ryp);
        }

        if (TOOL === "brush") {
          document.getElementById("pen").classList.add("is-active")
          t.buffer.noStroke();
          t.buffer.fill(p.red(c), p.green(c), p.blue(c), 10)
          for (let i = 0; i < 300; i++) {
            const v1 = p.createVector(rx, ry);
            const v2 = p5.Vector.random2D().mult(p.random(20));
            v1.add(v2);
            t.buffer.circle(v1.x, v1.y, 80 * p.noise(p.frameCount / 10));
          }
        }

        if (TOOL === "spraypaint") {
          t.buffer.noStroke();
          t.buffer.fill(p.red(c), p.green(c), p.blue(c), 100)
          for (let i = 0; i < 300; i++) {
            const v1 = p.createVector(rx, ry);
            const v2 = p5.Vector.random2D().mult(p.random(40));
            v1.add(v2);
            t.buffer.circle(v1.x, v1.y, p.random(3));
          }
        }
      }
    }
    p.noFill();
    p.rect(0, 0, TILE_SIZE, TILE_SIZE);
    p.rect(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
    p.rect(0, TILE_SIZE, TILE_SIZE, TILE_SIZE);
    p.rect(TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE);
  };
}, "editor");


// Generator

const generate = () => {
  for (let t of tiles) imagePool.push(t.buffer);
  mosaik = editor.createGraphics(TILE_SIZE * 4, TILE_SIZE * 4)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let x = i * TILE_SIZE;
      let y = j * TILE_SIZE;
      mosaik.image(editor.random(imagePool), x, y);
    }
  }
}

const generator = new p5((p) => {
  "use strict";
  p.setup = () => {
    p.createCanvas(800, 800);
  };
  p.draw = () => {
    if (mosaik) p.image(mosaik, 0, 0)
  };
}, "generator");
