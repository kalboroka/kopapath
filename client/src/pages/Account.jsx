import LoMain from '../layouts/LoMain';
import { LuMail, LuPhone } from '../components/Icons';

import userPh from "../assets/imgs/user.jpg";
import '../styles/Account.css';

const fmt = pn => `+254 ${pn.substring(3, 6)} ${pn.substring(6, 9)} ${pn.substring(9)}`

export default (p) => (
  <LoMain {...p}>
    <div className="account-container">
      <h4>Account</h4>
      <div class="profile">
        <img src={userPh} alt="user-placeholder"/>
        <div class="info">
          <h4 class="full-name">{p.user.name}</h4>
          <span class="email"><LuMail size={16}/> {p.user.email}</span>
          <span class="tel"><LuPhone size={16}/> {fmt(p.user.mobile)}</span>
        </div>
      </div>
    </div>
  </LoMain>
);
