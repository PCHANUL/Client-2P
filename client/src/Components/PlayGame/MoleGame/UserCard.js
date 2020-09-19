import React from 'react';
import cookie from 'react-cookies';
import {
  Paper,
  Grid,
  Typography
} from '@material-ui/core';


function UserCard({ width, userAvatar, myScore }) {
  return (
    <Paper 
      // className={classes.root} 
      style={{ 
        backgroundColor: 'white',
        borderRadius: '3vw',
        marginRight: '40px',
        width: `${width / 2}px`,
        height: `${width / 1.2}px`,
        padding: `${width / 6}px`,
      }}
    >
      <Grid container direction='column' justify='center' alignItems='center'>
        <img 
          src={userAvatar} 
          style={{
            width: width/2,
            height: width/2.2,
          }}
        ></img>
        <Typography 
          // className={classes.pos}
          style={{
            color: '#000',
            fontSize: `${width/15}px`
          }}
        >
          {cookie.load('username')}
        </Typography>
        <Typography 
          // className={classes.pos} 
          style={{
            color: '#000',
            fontSize: `${width/5}px`
          }}
        >
          {myScore}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default UserCard;