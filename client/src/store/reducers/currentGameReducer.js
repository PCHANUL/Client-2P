import * as actionTypes from '../actions';

const initialState = {
  currentGame: 0,
  gif: [],
};

const req = require.context('../../images/emoji', false, /.*\.gif$/);
req.keys().forEach(function (key) {
  initialState.gif.push(req(key));
});

console.log(initialState)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_GAME:
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
