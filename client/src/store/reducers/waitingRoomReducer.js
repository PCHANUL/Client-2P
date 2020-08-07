import * as actionTypes from '../actions';

const initialState = {
  selectedRoom: '',
  roomUsers: [],
  chat: [],
  joinedRoom: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_ROOM:
      return {
        ...state,
        selectedRoom: action.payload,
      };
    case actionTypes.LOAD_USER:
      // payload 에서 현재 방 유저들을 다 받아서 돌려준다.
      return {
        ...state,
        roomUsers: action.payload,
      };
    case actionTypes.CHAT_LOG:
      let chatCopy = state.chat.map((log) => {
        return { ...log };
      });
      return {
        ...state,
        chat: [...chatCopy, action.payload],
      };
    case actionTypes.LEAVE_ROOM:
      return {
        selectedRoom: '',
        roomUsers: [],
        chat: [],
        joinedRoom: false,
      };
    case actionTypes.READY:
      let userCopy = state.roomUsers.map((user) => {
        if (user.userInfo.username === action.payload) {
          user.userInfo.isReady = !user.userInfo.isReady;
        }
        return { ...user };
      });
      return {
        ...state,
        roomUsers: userCopy,
      };
    case 'JOINED_ROOM': {
      return {
        ...state,
        joinedRoom: true,
      };
    }
    default:
      return state;
  }
};

export default reducer;
