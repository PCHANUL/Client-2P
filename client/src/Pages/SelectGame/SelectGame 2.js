import React from 'react';
import GameList from '../../Components/GameList/GameList';

import WhackAMole from '../../Components/GameList/img/WhackAMole.jpg';
import Pong from '../../Components/GameList/img/Pong.jpg';
import FlipCard from '../../Components/GameList/img/FlipCard.png';

const flexContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '100px auto',
};

const SelectGame = () => {
  return (
    <div style={flexContainer}>
      <GameList image={WhackAMole} gameName='WhackAMole' />
      <GameList image={Pong} gameName='Pong' />
      <GameList image={FlipCard} gameName='FlipCard' />
    </div>
  );
};

export default SelectGame;
