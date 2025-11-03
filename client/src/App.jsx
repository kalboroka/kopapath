import { Component } from 'inferno';
import { Switch, Route } from 'inferno-router';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Loans from './pages/Loans';
import FQAs from './pages/FQAs';

import GuardRoute from './components/GuardRoute';

import { appReducer } from './utils/reducers';

export default class App extends Component {
  state = {
    modal: {
      on: false,
      msg: '',
      icon: null
    },
    sidebar: false,
    loading: false
  };

  dispatch = (action) => this.setState(appReducer(this.state, action));

  render() {
    return (
      <Switch>
        <Route path="/auth/signup" render={()=><Signup state={this.state} dispatch={this.dispatch} />} />
        <Route path="/auth/login" render={()=><Login state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute exact path="/" render={()=><Home state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/notifications" render={()=><Notifications state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/loans" render={()=><Loans state={this.state} dispatch={this.dispatch} />} />
        <GuardRoute path="/fqas" render={()=><FQAs state={this.state} dispatch={this.dispatch} />} />
      </Switch>
    );
  }
}