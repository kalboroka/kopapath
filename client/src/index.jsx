import { render } from 'inferno';
import { BrowserRouter } from 'inferno-router';
import App from './App';
import './index.css';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);