import { Component } from 'inferno';
import { Switch, Route } from 'inferno-router';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Loans from './pages/Loans';
import FQAs from './pages/FQAs';
import Account from './pages/Account';
import About from './pages/About';

import GuardRoute from './components/GuardRoute';

import { appReducer } from './utils/reducers';

export default class App extends Component {
  state = {
    modal: {
      on: false,
      msg: '',
      icon: null
    },
    user: {
      name: '...',
      mobile: ''
    }
  };

  dispatch = (action) => this.setState(appReducer(this.state, action));

  homeMounted = (_domNode) => {
    const user = window.sessionStorage.getItem('User');
    if (user)
      this.setState({ user: JSON.parse(user) })
  }

  render() {
    return (
      <Switch>
        <Route path="/auth/signup" render={(rtProps) => <Signup {...rtProps} state={this.state} dispatch={this.dispatch} />} />
        <Route path="/auth/login" render={(rtProps) => <Login {...rtProps} state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute exact path="/" render={(rtProps) => <Home {...rtProps} state={this.state} dispatch={this.dispatch} onComponentDidMount={this.homeMounted}/>} />
        <GuardRoute path="/messages" render={(rtProps) => <Messages {...rtProps} state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/loans" render={(rtProps) => <Loans {...rtProps} state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/fqas" render={(rtProps) => <FQAs {...rtProps} state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/account" render={(rtProps) => <Account {...rtProps} state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/about" render={(rtProps) => <About {...rtProps} state={this.state} dispatch={this.dispatch} />} />
      </Switch>
    );
  }
}