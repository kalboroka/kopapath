
export function toggleModal(modal, dispatch) {
  dispatch({
    type: 'setModal',
    value: { ...modal, on: !modal.on }
  });
}