import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Gameover from '../../Components/PlayGame/Gameover'
 
import {
  Paper,
  Typography,
  Tooltip,
  Fab,
  Grid,
  GridList,
  GridListTile
} from '@material-ui/core';

import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'

import { withStyles } from '@material-ui/core/styles';
import { Block } from './BDBlock';
import { RivalBlock } from './BDRivalBlock';
import { Bullet } from './Bullet'
import { isDeleteExpression } from 'typescript';
import cookie from 'react-cookies';
import socketio from 'socket.io-client';

import avatar from '../../images/bald.png';
import avatar2 from '../../images/gas-mask.png';

let socket
const styles = (theme) => ({
  Paper: {
    backgroundColor: 'black',
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    margin: theme.spacing(3, 3),
  },
  root: {
    width: theme.spacing(25),
    // height: theme.spacing(20),
    padding: theme.spacing(4, 4, 2, 2),
    backgroundColor: 'transparent',
    border: '2px solid #636363',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(13),
    marginLeft: '10px'
  },
  magazine: {
    width: theme.spacing(3),
    height: theme.spacing(35),
    backgroundColor: 'transparent',
    // border: '1px solid #fff',
  },
  pos: {
    color: '#fff',
  },
  reloadText: {
    color: '#fff',
    marginRight: '40px'
  },
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  rootroot: {
    position: 'fixed',
    right: '1%',
    bottom: '100px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 200,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Math.floor(document.body.clientWidth / 4),
      height: Math.floor(document.body.clientHeight / 1.2),

      // score
      myScore: 100,
      rivalScore: 100,

      // bullet
      bullet: 10,
      isReload: false,

      // winner
      winner: '',

      // emoji action
      showEmojis: false,
      isActive: false,
      rivalAvatar: avatar2,
      userAvatar: avatar,

    }

    //초기화
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;

    // Block
    this.blockSizeX = this.state.width / 10;
    this.blockSizeY = this.state.height / 20;
    this.blockPosX = (this.state.width / 2) - (this.blockSizeX / 2);
    this.blockPosY = this.state.height - (this.blockSizeY * 2)
    this.blockPosInitX = (this.state.width / 2) - (this.blockSizeX / 2);
    // Rival Block
    this.RivalSizeX = this.state.width / 10;
    this.RivalSizeY = this.state.height / 20;
    this.RivalPosX = (this.state.width / 2) - (this.RivalSizeX / 2);
    this.RivalPosY = this.RivalSizeY
    this.RivalPosInitX = (this.state.width / 2) - (this.RivalSizeX / 2);

    // Bullet
    this.BulletRadius = this.state.width / 40;
    this.BulletSpeed = this.state.width / 100;
    this.bullets = [];
    this.RivalBullets = [];
    this.aim = 0;
    this.moveY = 0;

    // mouse
    this.mousePos = 0;
    this.mouseX = 0;
    this.mouseY = 0;

    // Rival mouse
    this.RivalShotX = 0;
    this.RivalShotY = 0;

    // pre data
    this.preMousePos = 0;

    // mouse aim
    this.aim = 0;

    // get emoji
    this.tileData = [];
    this.props.gifEmoji.map((item) => {
      this.tileData.push({ img: item })
    })
  }

  componentDidMount() {
    socket = socketio.connect('http://15.164.170.101:3005');
    (() => {
      socket.emit('joinRoom', {
        username: cookie.load('username'),
        room: cookie.load('selectedRoom'),
      });
    })();
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.block = new Block(this.blockSizeX, this.blockSizeY, this.blockPosX, this.blockPosY, this.state.width, this.state.height);
    this.Rivalblock = new RivalBlock(this.RivalSizeX, this.RivalSizeY, this.RivalPosX, this.RivalPosY, this.state.width, this.state.height);

    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));


    // 블록 이동
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 65) {  // 왼쪽
        console.log('left')
        socket.emit('moveLeft');
        this.blockPosX -= this.blockSizeX;
        // this.RivalPosX -= this.blockSizeX; 
      } else if (e.keyCode === 68) {  // 오른쪽
        console.log('right')
        socket.emit('moveRight');
        this.blockPosX += this.blockSizeX;
        // this.RivalPosX += this.blockSizeX; 
      } else if (e.keyCode === 82) {  // 리로드
        console.log('reload');
        this.setState({ isReload: true });
        setTimeout(() => {
          this.setState({ bullet: 10 })
          this.setState({ isReload: false });
        }, 2500)
      }

      // Rival shot (mirror)
      socket.on('rivalShot', (e) => {
        if (e === 1) {  // right (this.aim === 1)
          this.RivalMoveX = this.BulletSpeed * -1;
          this.RivalMoveY = this.BulletSpeed;
        }
        else if (e === 0) {  // center (this.aim === 0)
          this.RivalMoveX = 0;
          this.RivalMoveY = this.BulletSpeed * 2;
        }
        else if (e === -1) {  // left (this.aim === -1)
          this.RivalMoveX = this.BulletSpeed;
          this.RivalMoveY = this.BulletSpeed;
        }
        let bullet = new Bullet(this.state.width, this.state.height,
          this.BulletRadius, this.RivalMoveX, this.RivalMoveY,
          this.RivalPosX, (this.RivalPosY + this.RivalSizeY), this.RivalSizeX
        )
        this.RivalBullets.push(bullet)
      })
    });

    socket.on('moveLeft', () => {
      this.RivalPosX += this.RivalSizeX;
    });
    socket.on('moveRight', () => {
      this.RivalPosX -= this.RivalSizeX;
    });
    socket.on('hit', (res) => {
      this.setState({ myScore: res });
    });
    socket.on('end', (winner) => {
      this.setState({ winner: winner });
    })

    // 발사
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.state.bullet > 0 && !this.state.isReload) {
        let bullet = new Bullet(this.state.width, this.state.height, this.BulletRadius, this.moveX, this.moveY, this.blockPosX, this.blockPosY, this.blockSizeX)
        this.bullets.push(bullet)
        socket.emit('shot', this.aim);
        this.setState({ bullet: this.state.bullet - 1 })
      }
    });

    // 조준
    this.canvas.addEventListener('mousemove', (e) => {
      let moveRight = e.layerX + this.state.width / 15
      let moveLeft = e.layerX - this.state.width / 15

      // 처리할 연산 줄이기
      if (moveRight < this.preMousePos || moveLeft > this.preMousePos) {
        this.mouseX = e.layerX;
        this.mouseY = e.layerY;
        this.angle = this.calc()
        // 왼쪽 조준
        if (this.angle > -40 && this.angle < 60) {
          this.moveX = this.BulletSpeed * -1;
          this.moveY = this.BulletSpeed;
          this.aim = -1;
        }
        // 중앙 조준
        else if (this.angle >= 60 && this.angle <= 120) {
          this.moveX = 0;
          this.moveY = this.BulletSpeed * 2;
          this.aim = 0;
        }
        // 오른쪽 조준
        else if (this.angle > 120 && this.angle < 180 || this.angle < -140) {
          this.moveX = this.BulletSpeed;
          this.moveY = this.BulletSpeed;
          this.aim = 1;
        }
        this.preMousePos = e.layerX
      }
    })
  }

  calc() {
    // 발사각 측정
    let BulletX = this.blockPosX + (this.blockSizeX / 2);
    let BulletY = this.state.height - 40;
    let width = (BulletX - this.mouseX)
    let height = (BulletY - this.mouseY)
    let angle = Math.floor(Math.atan2(height, width) * 180 / Math.PI);
    return angle
  }

  // 화면크기 재설정 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = Math.floor(this.stageWidth / 4);
    this.canvas.height = Math.floor(this.stageHeight / 1.2);

    this.setState({ width: this.canvas.width, height: this.canvas.height })
  }

  // block 위치 재설정
  initPos() {
    this.blockPosX = this.blockPosInitX;
    this.RivalPosX = this.RivalPosInitX
  }
  // 애니메이션 생성
  animate(t) {
    // 블록의 윈도우 충돌 핸들링
    if (this.blockPosX < 0) {
      this.blockPosX = 0
    } else if (this.blockPosX > this.state.width - this.blockSizeX) {
      this.blockPosX = this.state.width - this.blockSizeX
    } if (this.RivalPosX < 0) {
      this.RivalPosX = 0
    } else if (this.RivalPosX > this.state.width - this.RivalSizeX) {
      this.RivalPosX = this.state.width - this.RivalSizeX
    }
    window.requestAnimationFrame(this.animate.bind(this));

    // block draw clear
    this.ctx.clearRect(this.blockPosX, this.blockPosY, this.blockSizeX, this.blockSizeY)
    // RivalBlock draw clear
    this.ctx.clearRect(this.RivalPosX, this.RivalPosY, this.RivalSizeX, this.RivalSizeY)

    // guideline
    this.ctx.lineWidth = this.blockSizeX / 1.5;
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.moveTo(this.blockPosX + this.blockSizeX / 2, this.blockPosY + this.moveY);
    this.ctx.lineTo(this.blockPosX + (this.blockSizeX / 2) + (this.moveX * 7), (this.blockPosY - (this.blockSizeY) + Math.abs(this.moveX * 2)));
    this.ctx.stroke();

    this.block.draw(this.ctx, this.blockPosX, this.blockPosY)
    this.Rivalblock.draw(this.ctx, this.RivalPosX, this.RivalPosY)


    let response

    if (this.bullets.length !== 0) {
      for (let i = 0; i < this.bullets.length; i++) {
        response = this.bullets[i].drawMyBullet(
          this.ctx, this.state.width, this.state.height,
          this.RivalPosX, this.RivalPosY, this.RivalSizeX, this.RivalSizeY,
        )
        if (response) {
          this.bullets.splice(i, 1)
          if (response.result) this.setState({ rivalScore: this.state.rivalScore - 10 });
          console.log(this.state.myScore)
        };
      }
    }

    if (this.RivalBullets.length !== 0) {
      for (let i = 0; i < this.RivalBullets.length; i++) {
        response = this.RivalBullets[i].drawRivalBullet(
          this.ctx, this.state.width, this.state.height,
          this.blockPosX, this.blockPosY, this.blockSizeX, this.blockSizeY,
        )
        if (response) this.RivalBullets.splice(i, 1);
      }
    }

    // 잔상 남기는 구역설정
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);

    // 게임결과 출력시 화면 초기화
    if (response) {
      console.log(response);
      socket.emit('score', this.state.rivalScore);
      // this.Bullet.stoppp(true)
      // this.initPos()
      // socket.emit('start');
    }
  }

  makeBullet() {
    let magazine = [];
    for (let i = 0; i < this.state.bullet; i++) {
      magazine.push(
        <div style={{
          backgroundColor: '#ffff8c',
          width: '10px',
          height: '20px',
          margin: '7px'
        }} />
      )
    }
    return (
      <div>
        {magazine}
      </div>
    )
  }

  activeEmoji(gif) {
    this.setState({ userAvatar: gif });
    socket.emit('sendEmoji', (JSON.stringify(gif)));

    setTimeout(() => {
      this.setState({ userAvatar: avatar, isActive: !this.state.isActive });
    }, 2500);
  }

  activeRivalEmoji(gif) {
    this.setState({ rivalAvatar: gif });
    setTimeout(() => {
      this.setState({ rivalAvatar: avatar2 })
    }, 2500)
  }


  render() {
    const { classes } = this.props;
    return (
      <Grid container direction='row' justify='space-evenly' alignItems='center'>
        {this.state.winner !== '' ? <Gameover winner={this.state.winner} /> : null}

        <Grid item>
          <Paper className={classes.root} style={{ marginRight: '20px', marginLeft: '40px' }}>
            <Grid container direction='column' justify='center' alignItems='center'>
              <img src={this.state.rivalAvatar} className={classes.avatar}></img>
              <Typography className={classes.pos} variant='h5' component='h2'>
                {'Rival'}
              </Typography>
              <Typography className={classes.pos} color='textSecondary' variant='h1' component='h1'>
                {this.state.rivalScore}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper id="paper" style={{
            width: this.state.width,
            height: this.state.height,
            boxShadow: '0px 0px 20px 0px #d6d6d6',
            // boxShadow: '-5px -5px 20px 0px #5c0200, 0px 0px 30px 0px #d6d6d6, 5px 5px 20px 0px #b5af00',
          }} className={classes.Paper}>
            <canvas id="canvas" />
          </Paper>
        </Grid>
        <Paper className={classes.magazine} style={{ zIndex: 1 }}>
          {
            <Grid item>
              {this.makeBullet()}
            </Grid>
          }
        </Paper>
        <Grid item>
          <Paper className={classes.root} style={{ marginRight: '40px', zIndex: 1 }}>
            <Grid container direction='column' justify='center' alignItems='center'>
              <img src={this.state.userAvatar} className={classes.avatar}></img>
              <Typography className={classes.pos} variant='h5' component='h2'>
                {'you'}
              </Typography>
              <Typography className={classes.pos} variant='h1' component='h1'>
                {this.state.myScore}
              </Typography>
            </Grid>
          </Paper>
          <Typography className={classes.reloadText} variant='h5' component='h2'>
            {this.state.isReload
              ? '재장전중'
              : this.state.bullet === 0
                ? 'R을 눌러서 재장전하세요'
                : null
            }
          </Typography>
          <Tooltip title='이모티콘' aria-label='add' onClick={() => this.setState({ showEmojis: !this.state.showEmojis })}>
            <Fab color='secondary' className={this.props.classes.absolute}>
              <EmojiEmotionsIcon />
            </Fab>
          </Tooltip>
            <div className={classes.rootroot}>
              {
                this.state.showEmojis
                ? <GridList cellHeight={180} className={classes.gridList}>
                    {
                      this.tileData.map((tile) => (
                      <GridListTile key={tile.img} style={{ height: '100px'}} 
                        onClick={() => {
                          console.log('this.state.showEmojis: ', this.state.isActive);
                          if(this.state.isActive === false) {
                            this.activeEmoji(tile.img)
                            this.setState({ showEmojis: !this.state.showEmojis, isActive: !this.state.isActive })
                          }
                        }}
                      >
                        <img src={tile.img} alt={tile.title} style={{ width: '70px', height: '70px'}} />
                      </GridListTile>
                      ))
                    }
                  </GridList>
                : null
              }
            </div>
        </Grid>
      </Grid>
    );
  }
}
Game.propsTypes = {
  classes: PropTypes.object.isRequired,
};

const mapReduxStateToReactProps = (state) => {
  return {
    gifEmoji: state.currentGame.gif
  }
}
export default connect(mapReduxStateToReactProps)(withStyles(styles)(Game));

