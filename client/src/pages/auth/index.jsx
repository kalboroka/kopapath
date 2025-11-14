import { withRouter } from 'inferno-router';

import AuthForm from '../../components/AuthForm';

const Signup = withRouter((props) => <AuthForm {...props} mode="signup" />);
const Login = withRouter((props) => <AuthForm {...props} mode="login" />);

export { Signup, Login };
