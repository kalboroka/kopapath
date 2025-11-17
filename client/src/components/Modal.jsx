import '../styles/Modal.css';

export default (p/*{ on, msg, icon, close, onComponentDidMount }*/) => {
  return (
    <div class="alert-modal">
      <div class="wrapper">
        <div class="info">
          {p.icon}
          <span class="msg">{p.msg}</span>
        </div>
        <button class="close" onClick={p.close}>OK</button>
      </div>
    </div>
  );
}