import '../styles/Modal.css';

export default ({ on, msg, icon, close }) => {
  return (
    on ? (
      <div class="alert-modal">
        <div class="wrapper">
          <div class="info">
            {icon}
            <span class="msg">{msg}</span>
          </div>
          <button class="close" onClick={close}>OK</button>
        </div>
      </div>
    ) : null
  );
}