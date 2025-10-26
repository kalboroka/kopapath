import { render } from "inferno";
import { BrowserRouter } from 'inferno-router';

import Login from './pages/Login';
import Signup from './pages/Signup';

import './index.css';

render(
  <BrowserRouter>
    <Signup />
    <br />
    <Login />
  </BrowserRouter>,
  document.getElementById("app")
);