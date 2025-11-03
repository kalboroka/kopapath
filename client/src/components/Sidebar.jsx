import { NavLink } from 'inferno-router';
import { LuHome, LuBell, LuInfo, LuXCircle } from '../components/Icons';
import '../styles/Sidebar.css';

const links = [
  { icon: LuHome, label: 'Home', link: '/' },
  { icon: LuInfo, label: 'Loans', link: '/loans' },
  { icon: LuBell, label: 'Notifications', link: '/notifications' },
  { icon: LuInfo, label: 'Account', link: '#' },
  { icon: LuInfo, label: 'FQAs', link: '/fqas' },
  { icon: LuInfo, label: 'About', link: '#' },
];

export default (props) => (
  props.state.sidebar
    ? <div className="sidebar">
      <div className="wrapper">
        <ul className="links">
          <span
            className='close'
            onClick={() => props.dispatch({ type: 'setSidebar', value: false })}
          >
            <LuXCircle size={25} />
          </span>
          {links.map(({ icon: Icon, label, link }) => (
            <li key={label}><NavLink exact to={link}><Icon size={20} /> <span>{label}</span></NavLink></li>
          ))}
        </ul>
      </div>
    </div>
    : null
);