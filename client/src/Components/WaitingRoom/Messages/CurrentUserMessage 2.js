import React from 'react';
import './Message.css';

const CurrentUserMessage = () => {
  return (
    <div className='messageContainer justifyEnd'>
      <p className='sentText pr-10'>Current Username</p>
      <div className='messageBox backgroundBlue'>
        <p className='messageText colorWhite'>CurrentUser Text</p>
      </div>
    </div>
  );
};

export default CurrentUserMessage;
