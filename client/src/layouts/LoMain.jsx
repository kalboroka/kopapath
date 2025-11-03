import { withRouter, Link } from 'inferno-router';

import { apiPost } from '../utils/api';
import { session } from '../utils/session';

import { LuBell, LuMenu, LuLogOut, LuTriangleAlert } from '../components/Icons';
import Alert from '../components/Alert';
import Sidebar from '../components/Sidebar';

import '../styles/LoMain.css'

export default withRouter((props) => (
  <div class="container">
    <Sidebar {...props}/>

    <div class="header">
      <div class="logo">
        <h3 class="title"><Link to='/'>KopaPath</Link></h3>
      </div>
      <div class="utils">
        <span
          onClick={async () => {
            const data = await apiPost('/auth/logout', {}, session.get());
            if (data.ok) {
              session.clear();
              props.history.push('/auth/login');
            } else {
              props.dispatch({
                type: 'setMany',
                value: {
                  modal: {
                    on: true,
                    msg: data.error,
                    icon: <LuTriangleAlert size={24} color='red' />
                  }
                }
              })
            }
          }}
        >
          <LuLogOut size={20} color='darkslateblue' />
        </span>
        <Link to='/notifications'><LuBell size={20} color='darkslateblue' /></Link>
        <span
          onClick={()=>props.dispatch({type: 'setSidebar', value: true})}
        >
          <LuMenu size={20} color='darkslateblue' />
        </span>
      </div>
    </div>

    <div class="main">{props.children}</div>

    <div class="footer">
      <span>KopaPath &copy; {(new Date()).getFullYear()}</span>
    </div>

    <Alert
      on={props.state.modal.on}
      msg={props.state.modal.msg}
      icon={props.state.modal.icon}
      toggle={() => props.dispatch({ type: 'setModalOn', value: !props.state.modal.on })}
    />
  </div>
));