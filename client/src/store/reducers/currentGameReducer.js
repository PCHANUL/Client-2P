import * as actionTypes from '../actions';

const initialState = {
  currentGame: 0,
  gif: [
    'https://media.giphy.com/media/3ohzdPppZZDvvVtuPC/source.gif',
    'https://media.giphy.com/media/3ohzdG1pG0aDplHkBy/source.gif',
    'https://media.giphy.com/media/xUPGcnHcc9ItQfA29W/source.gif',
    'https://media.giphy.com/media/l1KVcNMJa7FyG2DdK/source.gif',
    'https://media.giphy.com/media/3ohzdIC9neHjucxQB2/source.gif',
    'https://media.giphy.com/media/3ohze0y1emAnzNgl32/source.gif',
    'https://media.giphy.com/media/3ohzdUl0b3O0153SNO/source.gif',
    'https://media.giphy.com/media/xUPGcCA1SMgFzuP2s8/source.gif',
    'https://media.giphy.com/media/xUPGcnXxRd0ZYd8Axy/source.gif',
    'https://media.giphy.com/media/xUPGcu27jqnR0mFrUI/source.gif',
    'https://media.giphy.com/media/xUPGcnbEOHGIfI2fZK/source.gif',
    'https://media.giphy.com/media/3og0IOalrRzSaLLPFe/source.gif',
    'https://media.giphy.com/media/3og0IGoStQwIfISP04/source.gif',
    'https://media.giphy.com/media/l1BgT4M5bQq84JhXq/source.gif',
    'https://media.giphy.com/media/ZEUODEtQiUZWGg6IHR/source.gif',
    'https://media.giphy.com/media/4BJCvMoLPePq8/source.gif',
    'https://media.giphy.com/media/cnX6sONPhNX7ge5zqG/source.gif',
    'https://media.giphy.com/media/j3W6QKA1IadbMrnemu/source.gif',
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_GAME:
      // action.payload 에 있는 정보로 로그인을 할수 있늕지 확인한 후, 로그인 스테이트를 바꿔준다.
      // 로그인 실패시
      // axios.post('login주소', {action.payload정보}, {withCredentials: true}, (result) => {
      // if (result.stauts === 200) return {...state, isLogin: true}
      // else return state
      // })
      return {
        ...state,
        currentGame: action.payload,
      };
    case actionTypes.RESELECT_GAME:
      return {
        ...state,
        currentGame: '',
      };
    default:
      return state;
  }
};

export default reducer;
