import { withRouter } from 'inferno-router';
import Modal from '../components/Modal';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/LoMain.css'

export default withRouter((props) => (
  <div class="container">
    <Header {...props} />

    <div class="main">{props.children}</div>

    <Footer />

    <Modal
      on={props.state.modal.on}
      msg={props.state.modal.msg}
      icon={props.state.modal.icon}
      close={() => props.dispatch({ type: 'setModal', value: { on: false } })}
    />
  </div>
));