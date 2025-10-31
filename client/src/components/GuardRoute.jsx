import { Route, Redirect } from 'inferno-router';

export default function GuardRoute({ component: WrappedComponent, render, ...rest }) {
  const token = window.sessionStorage.getItem('AccessToken');

  const renderComponent = (props) => {
    if (token) {
      return WrappedComponent ? <WrappedComponent {...props} /> : render(props);
    } else {
      return <Redirect to="/auth/login" />;
    }
  };

  return (
    <Route
      {...rest}
      render={renderComponent}
    />
  );
}
