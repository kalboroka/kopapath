import { Component } from 'inferno';
import AuthForm from '../../components/AuthForm';

export const Login = props => (
  <AuthForm
    mode="login"
    fields={['userid','secret']}
    {...props}
  />
);

export const Signup = props => (
  <AuthForm
    mode="signup"
    fields={['name','mobile','email','secret']}
    {...props}
  />
);

export const Reset = props => (
  <AuthForm
    mode="reset"
    fields={['secret']}
    {...props}
  />
);