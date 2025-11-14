import { Link } from 'inferno-router';
import LoMain from '../../layouts/LoMain';
import { LuAsterisk } from '../../components/Icons';

export default p => (
  <LoMain {...p}>
    <div class="loan-repay">
      <h4 class="lead">Loan Repayment</h4>
      <div class="info">
        <p>Repay via <strong>M-Pesa</strong> promptly to improve credit limit.</p>
        <ul>
          <li><LuAsterisk /> <span>Go to <strong>Lipa na M-Pesa → Paybill</strong></span></li>
          <li><LuAsterisk /> <span>Paybill: <strong>010101</strong></span></li>
          <li><LuAsterisk /> <span>Account: Your <strong>Mobile Number</strong></span></li>
          <li><LuAsterisk /> <span>Enter <strong>Amount</strong> & confirm</span></li>
        </ul>
        <p>If payment delay occurs, <Link to="/about">contact support</Link>.</p>
      </div>
    </div>
  </LoMain>
);