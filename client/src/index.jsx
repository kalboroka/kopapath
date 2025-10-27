import { render } from "inferno";
import { BrowserRouter, Route } from 'inferno-router';

import Login from './pages/Login';
import Signup from './pages/Signup';
import GuardRoute from './components/GuardRoute';

import './index.css';

const Home = (_props) => <h1>Welcome to KopaPath</h1>;

render(
  <BrowserRouter>
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/login" component={Login} />
      <GuardRoute exact path="/" component={Home} />
    </BrowserRouter>,
  document.getElementById("app")
);
