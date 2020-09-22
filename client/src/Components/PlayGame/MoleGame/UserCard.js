import React from 'react';
import cookie from 'react-cookies';
import {
  Paper,
  Grid,
  Typography
} from '@material-ui/core';


function UserCard({ width, userAvatar, theNumber, wrongInput, myTurn, warning }) {

  const style = {
    root: {
      backgroundColor: 'white',
      marginRight: '40px',
      borderRadius: `${width / 10}px`,
      width: `${width / 2}px`,
      height: `${width / 1.2}px`,
      padding: `${width / 6}px`,
      boxShadow: `${wrongInput 
        ? '0px 0px 20px 0px #ff5c5c' 
        : myTurn 
        ? `0px 0px ${width / 15}px 0px #0067c2`
        : '0px 0px 0px 0px #d6d6d6'
      }`,
    },
    font: {
      fontSize: `${width/15}px`,
    },
    countFont: {
      fontSize: `${width/5}px`,
    },
    avatarImg: {
      width: width/2,
      height: width/2.2,
    }
  }

  return (
    <Paper style={style.root}>
      <Grid container direction='column' justify='center' alignItems='center'>
        <img src={userAvatar} style={style.avatarImg} />
        <Typography style={style.font}>
          {cookie.load('username')}
        </Typography>
        <Typography style={style.countFont}>
          {theNumber}
        </Typography>
        {warning === 1 ? (
          <div
            style={{
              backgroundColor: 'yellow',
              width: `${document.body.clientWidth/80}px`,
              height: `${document.body.clientWidth/50}px`,
              border: `${document.body.clientWidth/400}px solid #000`,
            }}
          />
        ) : warning === 2 ? (
          <div
            style={{
              backgroundColor: 'red',
              width: `${document.body.clientWidth/80}px`,
              height: `${document.body.clientWidth/50}px`,
              border: `${document.body.clientWidth/400}px solid #000`,
            }}
          />
        ) : null}
      </Grid>
    </Paper>
  )
}

export default UserCard;