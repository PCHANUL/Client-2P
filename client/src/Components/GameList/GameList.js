import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, useHistory } from 'react-router-dom';
import cookie from 'react-cookies'
import { connect } from 'react-redux';

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Popover,
  Paper,
  Grow,
  Grid,
  IconButton,
} from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import SelectGame from '../../Pages/SelectGame/SelectGame';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '55vw',
    marginBottom: '2vw',
  },
  innerCard: {
    width: '100vw',
    height: '55vw',
  },
  button: {
    width: '40vw',
    height: '20vw',
    margin: '2vw',
  },
  practiceButton: {
    width: '90vw',
    height: '10vw',
  },
  title: {
    fontSize: '10vw',
  },
  desc: {
    fontSize: '2.5vw',
  },
  buttonFont: {
    fontSize: '5vw'
  }
}));

const gameDescription = {
  moleGame: {
    title: '두더지 잡기',
    desc: '두더지를 잡아라! 에잇!',
    code: 1,
  },
  bidGame: {
    title: '구슬동자',
    desc: '핑핑핑슝슝슝',
    code: 2,
  },
  baseballGame: {
    title: '숫자야구',
    desc: '원 스트라잌! 쓰리 볼!! ',
    code: 3,
  },
};

const fixedStyle = {
  card: {
    width: '600px',
    height: '300px',
  },
  paper: {
    width: '600px',
    height: '300px',
    margin: '20px',
  },
  button: {
    width: '220px',
    height: '100px',
    margin: '10px',
  },
  practiceButton: {
    width: '500px',
    height: '50px',
  },
  title: {
    fontSize: '50px',
  },
  desc: {
    fontSize: '15px',
  },
  buttonFont: {
    fontSize: '25px'
  }
};

const responsibleStyle = {
  card: {
    width: '100vw',
    height: '55vw',
  },
  paper: {
    width: '100vw',
    height: '55vw',
  },
  button: {
    width: '40vw',
    height: '20vw',
    margin: '2vw',
  },
  practiceButton: {
    width: '90vw',
    height: '10vw',
  },
  title: {
    fontSize: '10vw',
  },
  desc: {
    fontSize: '2.5vw',
  },
  buttonFont: {
    fontSize: '5vw'
  }

}

// 비로그인 유저
const guestLogin = () => {
  let randomName = Math.random().toString(36).substr(2, 5)
  let randomAvatar = String(Math.floor(Math.random() * 12))
  cookie.save('username', `Guest_${randomName}`, { path: '/' })
  cookie.save('avatarId', randomAvatar, { path: '/' })
}

const GameList = ({ image, gameName, getRooms, selectGame, makeRooms }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const [changeStyle, setChangeStyle] = useState(false);
  const [cardStyle, setCardStyle] = useState(responsibleStyle.card);
  const [paperStyle, setPaperStyle] = useState(responsibleStyle.paper);
  const [buttonStyle, setButtonStyle] = useState(responsibleStyle.button);
  const [practiceButtonStyle, setPracticeButtonStyle] = useState(responsibleStyle.practiceButton);
  const [titleStyle, setTitleStyle] = useState(responsibleStyle.title);
  const [descStyle, setDescStyle] = useState(responsibleStyle.desc);
  const [buttonFontStyle, setButtonFontStyle] = useState(responsibleStyle.buttonFont);

  useEffect(() => {
    if (changeStyle || window.innerWidth > 750) {
      setCardStyle(fixedStyle.card)
      setPaperStyle(fixedStyle.paper)
      setButtonStyle(fixedStyle.button)
      setPracticeButtonStyle(fixedStyle.practiceButton)
      setTitleStyle(fixedStyle.title)
      setDescStyle(fixedStyle.desc)
      setButtonFontStyle(fixedStyle.buttonFont)
    } else {
      setCardStyle(responsibleStyle.card)
      setPaperStyle(responsibleStyle.paper)
      setButtonStyle(responsibleStyle.button)
      setPracticeButtonStyle(responsibleStyle.practiceButton)
      setTitleStyle(responsibleStyle.title)
      setDescStyle(responsibleStyle.desc)
      setButtonFontStyle(responsibleStyle.buttonFont)
    }

    window.addEventListener('resize', resize, false);
    return () => {
      window.removeEventListener('resize', resize, false);
    }
  }, [changeStyle]);

  let resize = () => {
    if (window.innerWidth > 750) setChangeStyle(true)
    else setChangeStyle(false)
  }

  

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handlePopoverClose = (event) => {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);

  return (
    <Paper style={paperStyle}>
      {
        open
        ? 
        <Grow in={open}>
          <Card 
            elevation={4}
            style={cardStyle}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={handlePopoverClose}
          >
            <Grid container direction="row" justify="space-around" alignItems="center" style={{marginLeft: '5%'}}>
              <Grid item />
              <Typography style={titleStyle}>
                {gameDescription[gameName]['title']}
              </Typography>
              <IconButton >
                <CancelPresentationIcon />
              </IconButton>
            </Grid>
            <Typography style={{fontSize: descStyle.fontSize}}>
              {gameDescription[gameName]['desc']}
            </Typography>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
              <Grid item>
                <Button color="primary" disableElevation style={buttonStyle} variant="contained" 
                  onClick={() => {
                    cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                    if(!cookie.load('username')) guestLogin()
                    history.push('/selectroom')
                  }
                }>
                  <Typography style={{fontSize: buttonFontStyle.fontSize}}>
                    참가하기
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary" disableElevation style={buttonStyle} variant="contained"
                  onClick={() => {
                    cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                    if(!cookie.load('username')) guestLogin()
                    makeRooms()
                  }}
                >
                  <Typography style={{fontSize: buttonFontStyle.fontSize}}>
                    방 만들기
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Button disableElevation variant="contained" 
              style={practiceButtonStyle}
              onClick={() => {
                cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                if(!cookie.load('username')) guestLogin()
                history.push('/playgame')
              }}
            >
              <Typography style={{fontSize: buttonFontStyle.fontSize}}>
                연습하기
              </Typography>
            </Button>
          </Card>
        </Grow>
        :
        <CardMedia
          component='img'
          alt='gameImg'
          style={cardStyle}
          image={image}
          title={`${gameName} game`}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick={handlePopoverOpen}
        />
      }
    </Paper>
  );
};

const mapReduxDispatchToReactProps = (dispatch) => {
  return {
    makeRooms: function () {
      dispatch({ type: 'MAKE_ROOM' });
    },
  };
};

export default connect(null, mapReduxDispatchToReactProps)(withRouter(GameList));
