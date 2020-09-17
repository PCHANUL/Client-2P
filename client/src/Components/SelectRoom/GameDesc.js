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
    overflow: 'hidden',
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
    width: '86vw',
  }
}

const laptopStyle = {
  rootroot: {
    display: 'inline-block',
    padding: '20px 0px',
    width: '800px',
    height: '100px',
  },
  
}

function GameDesc() {


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
              <Accordion style={{ backgroundColor: `${game.color}`, width: '90vw' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ fontSize: '5vw' }} />} style={mobileStyle.root}>
                  <img src={game.img} style={mobileStyle.thumbnail} />
                  <Typography style={mobileStyle.font}>
                    {game.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{alignItems: 'center'}}>
                    <img src={game.dec} style={mobileStyle.descImg}/>
                </AccordionDetails>
              </Accordion>
            )
          })
        }
    </Grid>
  )
}

export default GameDesc;