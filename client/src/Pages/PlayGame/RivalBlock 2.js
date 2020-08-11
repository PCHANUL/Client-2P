export class RivalBlock {
  constructor(width, height, x, y, stageWidth, stageHeight) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.maxX = width + x;
    this.maxY = height + y;
    this.color = '#848484'
  }

  draw(ctx, x, y) {
    ctx.strokeStyle = '#848484';
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.rect(x, y, this.width, this.height);
    ctx.lineWidth = this.width / 10;
    ctx.stroke();
    ctx.fill();
  }
}

