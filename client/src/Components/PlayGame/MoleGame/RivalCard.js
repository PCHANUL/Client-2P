import React from 'react';
import cookie from 'react-cookies';
import {
  Paper,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';



function RivalCard({ 
  width, username, theNumber, avatar, computerModeStart, 
  myTurn = true, warningRival,
  cardTheme
}) {
  const style = {
    root: {
      backgroundColor: !cardTheme ? 'white' : 'transparent',
      border: !cardTheme ? null : '2px solid #636363',
      marginLeft: '40px',
      borderRadius: `${width / 10}px`,
      width: `${width / 2}px`,
      height: `${width / 1.2}px`,
      padding: `${width / 6}px`,
      boxShadow: `${!myTurn 
        ? '0px 0px 20px 0px #0067c2'
        : '0px 0px 0px 0px #d6d6d6' 
      }`,
    },
    font: {
      color: !username.length ? null : '#fff',
      fontSize: `${width/15}px`,
    },
    countFont: {
      color: !cardTheme ? '#000' : '#fff',
      fontSize: `${width/5}px`,
    },
    button: {
      width: `${width / 2}px`,
      height: `${width / 2}px`,
    },
    avatarImg: {
      width: width/2,
      height: width/2.2,
    }
  }

  const mobileStyle = {
    root: {
      backgroundColor: !cardTheme ? 'white' : 'transparent',
      border: !cardTheme ? null : '2px solid #636363',
      marginLeft: '40px',
      borderRadius: `${width / 10}px`,
      width: `${width / 2}px`,
      height: `${width / 1.2}px`,
      padding: `${width / 6}px`,
      boxShadow: `${!myTurn 
        ? '0px 0px 20px 0px #0067c2'
        : '0px 0px 0px 0px #d6d6d6' 
      }`,
      position: 'fixed',
      bottom: '10%',
      left: '10%',
    },
  }

  return (
    <Paper style={document.body.clientWidth > 750 ? style.root : mobileStyle.root}>
      <Grid container direction='column' justify='center' alignItems='center'>

        {!username.length ? (
          <Button color="secondary" variant="outlined" style={style.button} onClick={computerModeStart}>
            <Typography style={style.font}>
              컴퓨터<br/>대결시작
            </Typography>
          </Button>
        ) : (
          <>
            <img src={avatar} style={style.avatarImg} />
            <Typography style={style.font}>
              {username}
            </Typography>
          </>
        )}

        <Typography style={style.countFont}>
          {theNumber}
        </Typography>
        {warningRival === 1 ? (
          <div
            style={{
              backgroundColor: 'yellow',
              width: `${document.body.clientWidth/80}px`,
              height: `${document.body.clientWidth/50}px`,
              border: `${document.body.clientWidth/400}px solid #000`,
            }}
          />
        ) : warningRival === 2 ? (
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

export default RivalCard;