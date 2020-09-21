import React from 'react';
import cookie from 'react-cookies';
import {
  Paper,
  Grid,
  Typography
} from '@material-ui/core';


function UserCard({ width, userAvatar, myScore }) {

  const style = {
    root: {
      backgroundColor: 'white',
      marginRight: '40px',
      borderRadius: `${width / 10}px`,
      width: `${width / 2}px`,
      height: `${width / 1.2}px`,
      padding: `${width / 6}px`,
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
          {myScore}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default UserCard;