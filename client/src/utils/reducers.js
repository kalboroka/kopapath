/* AppState Reducer */
export function appReducer(state, action) {
  switch (action.type) {
    case 'setModal': return { ...state, modal: action.value };
    case 'setUser': return { ...state, user: action.value };
    case 'setMulti': return { ...state, ...action.value };
    default: return state;
  }
}