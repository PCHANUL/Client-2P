import React, { useState, useEffect } from 'react';

import { 
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


import moleGameDec from '../../images/moleGameDec.png';
import bidGameDec from '../../images/bidGameDec.png';
import baseballGameDec from '../../images/baseballGameDec.png';
import molethumbnail from '../../images/molethumbnail.png';
import bidthumbnail from '../../images/bidthumbnail.png';
import baseballthumbnail from '../../images/baseballthumbnail.png';

const mobileStyle = {
  root: {
    height: '15vw',
  },
  accordion: {
    width: '90vw', 
  },
  thumbnail: {
    width: '30vw',
    height: '15vw',
  },
  font: {
    color: '#fff',
    marginTop: '3vw',
    marginLeft: '8vw',
    fontSize: '6vw',
    fontWeight: 'bold'
  },
  descImg: {
    width: '100%',
  }
}

const laptopStyle = {
  root: {
    height: '120px',
  },
  accordion: {
    width: '720px', 
  },
  thumbnail: {
    width: '240px',
    height: '120px',
  },
  font: {
    color: '#fff',
    marginTop: '24px',
    marginLeft: '50px',
    fontSize: '48px',
    fontWeight: 'bold'
  },
  descImg: {
    width: '100%',
  }
  
}

function GameDesc() {
  const [styleName, setStyleName] = useState({});

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize, false);
    return () => {
      window.removeEventListener('resize', resize, false);
    }
  }, [styleName])

  const resize = () => {
    if (window.innerWidth > 750) {
      setStyleName(laptopStyle);
    } else {
      setStyleName(mobileStyle);
    }
  };

  const games = [
    {
      name: '두더지 게임',
      img: molethumbnail,
      dec: moleGameDec,
      color: '#00C8DE',
    }, 
    {
      name: '구슬 동자',
      img: bidthumbnail,
      dec: bidGameDec,
      color: '#545454',
    }, 
    {
      name: '숫자 야구',
      img: baseballthumbnail,
      dec: baseballGameDec,
      color: '#2D65AA'
    }, 
  ];

  return (
    <Grid container direction='column' justify='space-evenly' alignItems='center' style={{ marginTop: '2vw'}}>
        {
          games.map((game) => {
            return (
              <Accordion style={{ ...styleName.accordion, backgroundColor: `${game.color}` }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ fontSize: '5vw' }} />} style={styleName.root}>
                  <img src={game.img} style={styleName.thumbnail} />
                  <Typography style={styleName.font}>
                    {game.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <img src={game.dec} style={styleName.descImg}/>
                </AccordionDetails>
              </Accordion>
            )
          })
        }
    </Grid>
  )
}

export default GameDesc;