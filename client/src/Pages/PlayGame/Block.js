export class Block {
  constructor(width, height, x, y, stageWidth, stageHeight) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.maxX = width + x;
    this.maxY = height + y;
    this.color = '#ff384e'
  }

  draw(ctx, y) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, y, this.width, this.height);
    ctx.fill();
  }
}

