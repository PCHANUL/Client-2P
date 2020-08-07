import * as actionTypes from '../actions';

function createDate(gameCode, roomName, isWait, isLocked, isFull) {
  return { gameCode, roomName, isWait, isLocked, isFull };
}

const initialState = {
  roomList: [],
  isMaking: false,
  currentGame: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENT_GAME:
      return {
        ...state,
        currentGame: action.currentGame,
      };
    case actionTypes.MAKE_ROOM:
      return {
        ...state,
        isMaking: true,
      };
    case actionTypes.MAKE_ROOM_CLOSE:
      return {
        ...state,
        isMaking: false,
      };
    case actionTypes.GET_ROOMS:
      // let mole = []
      // let pong = []
      // let card = []

      // action.payload.map(function(room){
      //   if (room.gameCode === '0') {
      //     mole.push(createDate(room.gameCode, room.roomName, true, room.isLocked, room.userNum === 1 ? false : true));
      //   } else if (room.gameCode === '1') {
      //     pong.push(createDate(room.gameCode, room.roomName, true, room.isLocked, room.userNum === 1 ? false : true));
      //   }
      // })

      return {
        ...state,
        roomList: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
