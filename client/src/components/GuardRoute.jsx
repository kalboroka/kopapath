import { Route, Redirect } from 'inferno-router';

export default function GuardRoute({ component: WrappedComponent, render, ...rest }) {
  const token = window.sessionStorage.getItem('AccessToken');

  const renderComponent = (props) => {
    if (!token) return <Redirect to="/auth/login" />;

    if (WrappedComponent) return <WrappedComponent {...props} />;
    if (render) return render(props);

    // Safety fallback
    return null;
  };

  return <Route {...rest} render={renderComponent} />;
}