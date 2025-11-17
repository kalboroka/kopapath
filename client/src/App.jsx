import { Component } from 'inferno';
import { Switch, Route } from 'inferno-router';

import { Signup, Login, Reset } from './pages/auth';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Loans from './pages/loans';
import FQAs from './pages/FQAs';
import Account from './pages/Account';
import About from './pages/About';

import GuardRoute from './components/GuardRoute';
import Modal from './components/Modal';

import { appReducer, session } from './utils';

const mounted = (_domNode) => {
  const meta = window.document.querySelector('meta[name="theme-color"]');
  if(!meta)return;
  meta.setAttribute('content', '#606060')
  
}

const unMounted = (_domNode) => {
  const meta = window.document.querySelector('meta[name="theme-color"]');
  if(!meta)return;
  meta.setAttribute('content', '#FFEFD5')
  
}

export default class App extends Component {
  state = {
    modal: { on: false, msg: '', icon: null },
    user: { name: '...', mobile: '' }
  };

  dispatch = (action) => this.setState(appReducer(this.state, action));

  componentDidMount() {
    const user = session.get('User');
    if (user)
      this.setState({ user })
  }

  render() {
    return (
      <>
        <Switch>
          <Route path="/auth/signup" render={(rtProps) => <Signup {...rtProps} dispatch={this.dispatch} />} />
          <Route path="/auth/login" render={(rtProps) => <Login {...rtProps} dispatch={this.dispatch} />} />
          <Route path="/auth/reset" render={(rtProps) => <Reset {...rtProps} dispatch={this.dispatch} />} />
          <GuardRoute exact path="/" render={(rtProps) => <Home {...rtProps} user={this.state.user} />} />
          <GuardRoute path="/messages" render={(rtProps) => <Messages {...rtProps} user={this.state.user} dispatch={this.dispatch} />} />
          <GuardRoute path="/loans" render={(rtProps) => <Loans {...rtProps} user={this.state.user} dispatch={this.dispatch} />} />
          <GuardRoute path="/fqas" render={(rtProps) => <FQAs {...rtProps} />} />
          <GuardRoute path="/account" render={(rtProps) => <Account {...rtProps} user={this.state.user} />} />
          <GuardRoute path="/about" render={(rtProps) => <About {...rtProps} />} />
        </Switch>
        {this.state.modal.on&&<Modal {...this.state.modal} onComponentDidMount={mounted} onComponentWillUnmount={unMounted} close={()=>this.setState({modal:{...this.state.modal,on:false}})}/>}
      </>
    );
  }
}