import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Block } from './Block';
import { Ball } from './Ball'
import { isDeleteExpression } from 'typescript';

const styles = (theme) => ({
  Paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    margin: theme.spacing(3, 3),
  }
});

let blockPosX
let blockPosY
let dy = 10
let preKey

document.addEventListener('keydown', (e) => {
  // dy까지의 모든 수를 더해줍니다.
  if(e.keyCode === 40){
    dy += 15
    blockPosY += dy
    
  } else if(e.keyCode === 38){
    dy += 15
    blockPosY -= dy
  }
})

document.addEventListener('keyup', (e) => {
  if(e.keyCode === 40 ){
    console.log('blockPosY: ', dy, blockPosY);
    for(let i; i<dy; i++){
      blockPosY += i
    }
    dy = 10;
  } else if(e.keyCode === 38 ){
    console.log('blockPosY: ', dy, blockPosY);
    dy = 10;
  }
})




class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 100,
      width: document.body.clientWidth / 1.5,
      height: document.body.clientHeight / 1.5,
    }
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;
    blockPosX = 50;
    blockPosY = 300;
    this.blockSizeX = 10;
    this.blockSizeY = 100;

    
  }
  
  
  
  
  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    
    // 화면크기 재설정 이벤트
    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    this.ball = new Ball(document.body.clientWidth / 1.5, document.body.clientHeight / 1.5, 6, 5)
    this.block = new Block(this.blockSizeX, this.blockSizeY, blockPosX, blockPosY, document.body.clientHeight / 1.5, document.body.clientHeight / 1.5);
    
    window.requestAnimationFrame(this.animate.bind(this));
    
  } 
 
  // 화면크기 재설정 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
 
    // 화면크기, 블록크기 설정
    this.canvas.width = this.stageWidth / 1.5;
    this.canvas.height = this.stageHeight / 1.5;
    this.blockSizeX = this.canvas.width / 30;
    this.blockSizeY = this.canvas.height / 3;

    this.setState({ width: this.canvas.width, height: this.canvas.height })
  }

  animate(t) {
    // 벽돌 충돌감지
    if(blockPosY < 0){
      blockPosY = 0
    } else if(blockPosY > this.canvas.height - 100){
      blockPosY = this.canvas.height - 100
    }
    
    
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight)
    this.block.draw(this.ctx, blockPosY)

    this.ball.draw(this.ctx, this.canvas.width, this.canvas.height, blockPosX, blockPosY, this.blockSizeX, this.blockSizeY) 
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper id="paper" style={{
        width: this.state.width,
        height: this.state.height
        }} className={classes.Paper}>
        <canvas id="canvas" />
      </Paper>

    );
  }
}

Game.propsTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Game);