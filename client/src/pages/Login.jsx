import { withRouter } from 'inferno-router';

import AuthForm from '../components/AuthForm';

export default withRouter((props) => <AuthForm {...props} mode="login" />);
