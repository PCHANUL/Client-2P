import React, { useState } from 'react';
import './Input.css';

const Input = () => {
  const [message, setMessage] = useState('');

  return (
    <form className='form'>
      <input
        type='text'
        className='input'
        placeholder='메시지를 입력하세요'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === 'Enter' ? console.log(1) : null)}
      />
      <button className='sendButton' onClick={() => console.log(1)}>
        Send
      </button>
    </form>
  );
};

export default Input;
