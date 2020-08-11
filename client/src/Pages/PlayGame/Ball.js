export class Ball {
  constructor(stageWidth, stageHeight, radius, speed) {
    this.radius = radius;
    this.speed = speed;
    this.vx = speed;
    this.vy = speed;
    this.x = stageWidth / 2;
    this.y = stageHeight / 2;
    this.stop = true;
    this.blockPrePosX = 0;
    this.RivalPrePosX = 0;
  }

  draw(ctx, stageWidth, stageHeight, 
    blockPosX, blockPosY, blockSizeX, blockSizeY,
    RivalPosX, RivalPosY, RivalSizeX, RivalSizeY) 
    {

    const response = this.bounceWindow(stageWidth, stageHeight);
    
    this.bounceBlock(blockPosX, blockPosY, blockSizeX, blockSizeY);
    this.bounceRival(RivalPosX, RivalPosY, RivalSizeX, RivalSizeY);
    
    ctx.fillStyle = '#ffff8c';
    ctx.beginPath();

    // Ball 제어
    if(!this.stop){
      this.x += this.vx;
      this.y += this.vy;
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    } else {
      this.x = stageWidth / 2;
      this.y = stageHeight / 2;
      this.vx = 0;
      this.vy = this.speed;
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    }
    
    ctx.fill();

    this.blockPrePosX = blockPosX;
    this.RivalPrePosX = RivalPosX;
    
    if(response){
      return response
    }
  }

  stoppp(myTurn) {
    this.stop = !this.stop;
    if(!myTurn){
      this.vx *= -1;
      this.vy *= -1;
    }
  }

  bounceWindow(stageWidth, stageHeight) {
    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1;
      this.x += this.vx;
    } else  if (this.y <= minY) {
      this.vy *= -1;
      this.y += this.vy;
      return { gameResult: true }
    } else if (this.y >= maxY) {
      this.vy *= -1;
      this.y += this.vy;
      return { gameResult: false }
    }
  }

  bounceBlock(blockPosX, blockPosY, blockSizeX, blockSizeY) {
    const minX = blockPosX - this.radius;
    const maxX = blockPosX + blockSizeX + this.radius;
    const minY = blockPosY - this.radius;
    const maxY = blockPosY + blockSizeY + this.radius;

    if(this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
      const x1 = Math.abs(minX - this.x);
      const x2 = Math.abs(this.x - maxX);
      const y1 = Math.abs(minY - this.y);
      const y2 = Math.abs(this.y - maxY);
      const min1 = Math.min(x1, x2);
      const min2 = Math.min(y1, y2);
      const min = Math.min(min1, min2);

      if (min === min1) {    // 좌우
        this.vx *= -1;
        this.vy *= -1;
        if (x2 === min) {
          console.log('right')
          // this.vx += this.speed;
          this.x = maxX;
          this.y = minY;
        } else if (x1 === min) {
          console.log('left')
          // this.vx -= this.speed;
          this.x = minX;
          this.y = minY;
        }
      } else if (min === min2) {    //상하
        this.vy *= -1;
        // 스타트
        if (this.vx === 0) {
          this.vy -= this.speed/2;
          console.log('this.blockPrePosX > blockPosX: ', this.blockPrePosX, blockPosX);
          if (this.blockPrePosX - (this.speed * 1.5) > blockPosX) {
            console.log('왼쪽으로 움직임')
            this.vx -= this.speed/2;
          } 
          if (this.blockPrePosX + (this.speed * 1.5) < blockPosX) {
            console.log('오른쪽으로 움직임')
            this.vx += this.speed/2;
          }
        }
        // 공의 방향감지
        else if (Math.sign(this.vx) === -1) {
          console.log('오른쪽에서')
          console.log(this.blockPrePosX, blockPosX)
          // 블록의 방향감지
          if (this.blockPrePosX - (this.speed * 1.5) > blockPosX) {
            console.log('왼쪽으로 움직임')
            this.vx -= this.speed;
          } else if (this.blockPrePosX + (this.speed * 1.5) < blockPosX) {
            console.log('오른쪽으로 움직임')
            this.vx += this.speed;
          }
        } else if (Math.sign(this.vx) === 1) {
          console.log('왼쪽에서')
          console.log(this.blockPrePosX, blockPosX)
          // 블록의 방향감지
          if (this.blockPrePosX - (this.speed * 1.5) > blockPosX) {
            console.log('왼쪽으로 움직임')
            this.vx -= this.speed;
          } else if (this.blockPrePosX + (this.speed * 1.5) < blockPosX) {
            console.log('오른쪽으로 움직임')
            this.vx += this.speed;
          }
        }

        // 위 또는 아래에 부딪힌 경우
        if (y1 === min) {
          console.log('top')
          this.vy -= this.speed/10;
          this.y = minY;
        } else if (y2 === min) {
          console.log('bottom')
          this.y = minY - this.speed;
        }
      }
    }
  }

  bounceRival(RivalPosX, RivalPosY, RivalSizeX, RivalSizeY) {
    const minX = RivalPosX - this.radius;
    const maxX = RivalPosX + RivalSizeX + this.radius;
    const minY = RivalPosY - this.radius;
    const maxY = RivalPosY + RivalSizeY + this.radius;

    if(this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
      const x1 = Math.abs(minX - this.x);
      const x2 = Math.abs(this.x - maxX);
      const y1 = Math.abs(minY - this.y);
      const y2 = Math.abs(this.y - maxY);
      const min1 = Math.min(x1, x2);
      const min2 = Math.min(y1, y2);
      const min = Math.min(min1, min2);

      if(min === min1) {  // 좌우
        this.vx *= -1;
        this.vy *= -1;
        if (x2 === min) {
          console.log('right')
          this.vx += this.speed;
          this.x = maxX;
          this.y = maxY;
        } else if (x1 === min) {
          console.log('left')
          this.vx -= this.speed;
          this.x = minX;
          this.y = maxY;
        }
      } else if (min === min2) {   // 상하
        this.vy *= -1;
        
        // 스타트
        if (this.vx === 0) {
          console.log('this.RivalPrePosX > RivalPosX: ', this.RivalPrePosX, RivalPosX);

          if (this.RivalPrePosX - (this.speed * 1.5) > RivalPosX) {
            console.log('왼쪽으로 움직임')
            this.vx -= this.speed/2;
          } 
          if (this.RivalPrePosX + (this.speed * 1.5) < RivalPosX) {
            console.log('오른쪽으로 움직임')
            this.vx += this.speed/2;
          }
        }
        // 공의 방향감지
        else if (Math.sign(this.vx) === -1) {
          console.log('오른쪽에서')
          console.log(this.RivalPrePosX, RivalPosX)
          // 블록의 방향감지
          if (this.RivalPrePosX - (this.speed * 1.5) > RivalPosX) {
            console.log('왼쪽으로 움직임')
            this.vx -= this.speed;
          } else if (this.RivalPrePosX + (this.speed * 1.5) < RivalPosX) {
            console.log('오른쪽으로 움직임')
            this.vx += this.speed;
          }
        } else if (Math.sign(this.vx) === 1) {
          console.log('왼쪽에서')
          console.log(this.RivalPrePosX, RivalPosX)
          // 블록의 방향감지
          if (this.RivalPrePosX - (this.speed * 1.5) > RivalPosX) {
            console.log('왼쪽으로 움직임')
            this.vx -= this.speed;
          } else if (this.RivalPrePosX + (this.speed * 1.5) < RivalPosX) {
            console.log('오른쪽으로 움직임')
            this.vx += this.speed;
          }
        }


        // 아래 또는 위에 부딪힌 경우
        if (y1 === min) {
          console.log('top')
          this.y = maxY + this.speed;
        } else if (y2 === min) {
          console.log('bottom')
          this.vy += this.speed/10;
          console.log('this.speed/10: ', this.speed/10);
          this.y = maxY + this.speed;
        }
      }
    }
  }
}