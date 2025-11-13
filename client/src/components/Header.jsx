import { Component } from 'inferno';
import { Link } from 'inferno-router';
import Sidebar from './Sidebar';
import { LuCircleUser, LuMessageCircle, LuMenu, LuX } from '../components/Icons';

export default class Header extends Component {
  state = {
    sidebar: false
  }

  toggleSidebar = () => this.setState({ sidebar: !this.state.sidebar })

  render() {
    return (
      <div class="header">
        <div class="wrapper">
          <Sidebar {...this.props} sidebar={this.state.sidebar} />
          <div class="logo">
            <h3 class="title"><Link to='/'>KopaPath</Link></h3>
          </div>
          <div class="utils">
            <Link to='/account'><LuCircleUser size={20} color='darkslateblue' /></Link>
            <Link to='/messages'><LuMessageCircle size={20} color='darkslateblue' /></Link>
            <span
              onClick={() => this.toggleSidebar()}
            >
              {
                this.state.sidebar ?
                  <LuX size={20} color='darkslateblue' /> :
                  <LuMenu size={20} color='darkslateblue' />
              }
            </span>
          </div>
        </div>
      </div>
    )
  }
}