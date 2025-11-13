import { linkEvent } from 'inferno';
import { NavLink } from 'inferno-router';
import { LuCircleQuestionMark, LuCoins, LuHome, LuMessageCircle, LuInfo, LuCircleUser, LuLogOut, LuTriangleAlert } from '../components/Icons';
import { apiFetch } from '../utils/api';
import { session } from '../utils/session';

import '../styles/Sidebar.css';

const links = [
  { icon: LuHome, label: 'Home', link: '/' },
  { icon: LuCoins, label: 'Loans', link: '/loans' },
  { icon: LuMessageCircle, label: 'Messages', link: '/messages' },
  { icon: LuCircleUser, label: 'Account', link: '/account' },
  { icon: LuCircleQuestionMark, label: 'FQAs', link: '/fqas' },
  { icon: LuInfo, label: 'About', link: '/about' }
];

const onClick = async (props, _event) => {
  const { ok, data } = await apiFetch('/api/v1/auth/logout', { method: 'POST', bearer: session.get() });
  if (ok) {
    session.clear();
    props.history.push('/auth/login');
  } else {
    props.dispatch({
      type: 'setModal',
      value: {
        on: true,
        msg: data.error,
        icon: <LuTriangleAlert size={24} color='red' />
      }
    })
  }
}

export default (props) => (
  props.sidebar ?
    <div className="sidebar">
      <div className="wrapper">
        <ul className="links">
          {links.map(({ icon: Icon, label, link }) => (
            <li key={label}><NavLink exact to={link}><Icon size={20} /> <span>{label}</span></NavLink></li>
          ))}
          <button onClick={linkEvent(props, onClick)}><LuLogOut size={20} /> <span>Logout</span></button>
        </ul>
      </div>
    </div>
    : null
);