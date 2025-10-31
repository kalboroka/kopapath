/* AppState Reducer */
export function appReducer(state, action) {
  switch (action.type) {
    case 'setModalOn': return { ...state, modal: { ...state.modal, on: action.value } };
    case 'setModalMsg': return { ...state, modal: { ...state.modal, msg: action.value } };
    case 'setLoading': return { ...state, loading: action.value };
    case 'setMany': return { ...state, ...action.value };
    default: return state;
  }
}