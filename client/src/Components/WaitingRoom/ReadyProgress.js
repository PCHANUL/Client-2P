// import React, { useState, useEffect } from 'react';

// const ReadyProgress = () => {
//   const [timer, setTimer] = useState(5);
//   useEffect(() => {
//     if (timer >= 1) {
//       setTimeout(() => {
//         setTimer((prevState) => prevState - 1);
//       }, 1000);
//     }
//   }, [timer]);
//   // return (
//   //  <div className='centered'>GAME STARTS IN {timer}</div>
//   // )
//   return timer > 0 ? <div className='centered'>GAME STARTS IN {timer}</div> : null;
// };

// export default ReadyProgress;

import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

import gameStart from '../../images/unnamed.gif';
// import gameStart from './img/readyImg.jpeg';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import cookie from 'react-cookies';

const useStyles = makeStyles({
  root: {
    maxWidth: 450,
    maxHeigh: 350,
    opacity: 0.97,
    zIndex: 100,
    position: 'fixed',
    background: '#757ce8',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

function ReadyProgress() {
  const classes = useStyles();
  const history = useHistory();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (timer < 0) {
      cookie.save('isPlaying', true, { path: '/' })
      return history.push('/playgame');
    }
    setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component='img'
          alt='game start'
          height='140'
          image={gameStart}
          title='game start'
        />
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='h2' variant='h5'>
            {timer}초 후 게임이 시작됩니다.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withRouter(ReadyProgress);
