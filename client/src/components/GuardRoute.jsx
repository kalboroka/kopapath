import { Route, Redirect } from 'inferno-router';

export default function({ component: WrappedComponent, ...rest }) {
  const token = window.sessionStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={(props) => {
        return token ?
          <WrappedComponent {...props} />:
          <Redirect to="/auth/login" />
        }
      }
    />
  );
};
