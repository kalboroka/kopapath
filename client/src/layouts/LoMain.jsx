import { withRouter } from 'inferno-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/LoMain.css'

export default withRouter((props) => (
  <div class="container">
    <Header {...props} />

    <div class="main">{props.children}</div>

    <Footer />
  </div>
));