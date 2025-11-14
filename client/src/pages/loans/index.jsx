import { Switch, withRouter } from 'inferno-router';
import GuardRoute from '../../components/GuardRoute';
import LoanHist from './LoanHist';
import LoanApply from './LoanApply';
import LoanRepay from './LoanRepay';

import '../../styles/Loans.css';

export default withRouter((p) => (
  <Switch>
    <GuardRoute exact path={p.match.path}
      render={rp => <LoanHist {...p} {...rp} />} />
    <GuardRoute path={`${p.match.path}/apply`}
      render={rp => <LoanApply {...p} {...rp} />} />
    <GuardRoute path={`${p.match.path}/repay`}
      render={rp => <LoanRepay {...p} {...rp} />} />
  </Switch>
));
