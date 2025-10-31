import '../styles/Alert.css';

export default ({ on, msg, icon, toggle }) => {
  return (
    on ? (
      <div class="alert-modal">
        <div class="wrapper">
          <div class="info">
            {icon}
            <span class="msg">{msg}</span>
          </div>
          <button class="toggle" onClick={toggle}>OK</button>
        </div>
      </div>
    ) : null
  );
}