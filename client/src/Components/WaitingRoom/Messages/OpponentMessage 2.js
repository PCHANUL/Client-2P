import React from 'react';
import './Message.css';

const OpponentMessage = () => {
  return (
    <div className='messageContainer justifyStart'>
      <div className='messageBox backgroundLight'>
        <p className='messageText colorDark'>Opponent Text</p>
      </div>
      <p className='sentText pl-10 '>Opponent username</p>
    </div>
  );
};

export default OpponentMessage;
