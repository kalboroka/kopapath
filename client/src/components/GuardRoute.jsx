import { Route, Redirect } from 'inferno-router';
import { session } from '../utils';

export default function GuardRoute({ component: WrappedComponent, render, ...rest }) {
  const renderComponent = (props) => {
    if (!session.isLoggedIn()) return <Redirect to="/auth/login" />;

    if (WrappedComponent) return <WrappedComponent {...props} />;
    if (render) return render(props);

    // Safety fallback
    return null;
  };

  return <Route {...rest} render={renderComponent} />;
}