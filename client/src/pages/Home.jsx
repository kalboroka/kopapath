import { withRouter } from 'inferno-router';

import { session } from '../utils/session';
import { apiPost } from '../utils/api';

export default withRouter((props) => (
  <h1
    onClick={async () => {
      await apiPost('/auth/logout', {}, session.get());
      session.clear();
      props.history.push('/auth/login');
    }}
    style={{ 'text-align': 'center' }}
  >
    Welcome to KopaPath<br/><br/>Logout
  </h1>
));