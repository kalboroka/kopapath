import { Component } from 'inferno';
import { Link } from 'inferno-router';

import { LuEye, LuEyeOff, LuTriangleAlert } from '../components/Icons';
import { mobileRegex, secretRegex } from '../utils/regex';

import '../styles/AuthForm.css';

export default class Login extends Component {
  state = {
    mobile: '',
    secret: '',
    showSecret: false,
    errors: [false, false],
    loading: false
  }

  onInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const errors = [...this.state.errors];

    if (name === 'mobile') errors[0] = !mobileRegex.test(value);
    else if (name === 'secret') errors[1] = !secretRegex.test(value);

    this.setState({ [name]: value, errors });
  }

  toggleMask = () => this.setState({ showSecret: !this.state.showSecret });

  render() {
    return (
      <div className="form-container">
        <div className="form-input-wrapper">
          <div class="logo">
            <h1 class="title">KopaPath</h1>
            <small class="slogan">Future is now</small>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-info">
              <label htmlFor="mobile">Mobile</label>
              <input
                name="mobile"
                type="tel"
                placeholder="254X-XX-XXX-XXX"
                value={this.state.mobile}
                onInput={this.onInput}
                required
              />
              {this.state.errors[0] && <LuTriangleAlert />}
            </div>

            <div className="input-secret">
              <label htmlFor="secret">Secret</label>
              <input
                name="secret"
                type={this.state.showSecret ? 'text' : 'password'}
                placeholder="$tr0nGs3cr3t"
                value={this.state.secret}
                onInput={this.onInput}
                required
              />
              <button
                type="button"
                onClick={this.toggleMask}
                className="mask-btn"
                aria-label="Toggle password visibility"
              >
                {this.state.showSecret ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
              {this.state.errors[1] && <LuTriangleAlert />}
            </div>

            <small class="cta">New here? <Link to="/auth/signup">Signup</Link> now</small>

            <div className="btn-submit">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}