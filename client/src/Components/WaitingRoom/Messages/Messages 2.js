import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import OpponentMessage from './OpponentMessage';
import CurrentUserMessage from './CurrentUserMessage';
import './Messages.css';

const Messages = () => {
  return (
    <ScrollToBottom className='messages'>
      <OpponentMessage />
      <OpponentMessage />
      <CurrentUserMessage />
      <CurrentUserMessage />
    </ScrollToBottom>
  );
};

export default Messages;
