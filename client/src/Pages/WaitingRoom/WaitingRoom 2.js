import React from 'react';
import Users from '../../Components/WaitingRoom/Users/Users';
import Chat from '../../Components/WaitingRoom/Chat/Chat';
import Input from '../../Components/WaitingRoom/Input/Input';

import './WaitingRoom.css';

const WaitingRoom = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Users />
        <Users />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='container'>
          <Chat />
          <Input />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
