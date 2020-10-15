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