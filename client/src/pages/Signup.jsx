import { Component } from 'inferno';
import { Link } from 'inferno-router';

import { LuEye, LuEyeOff, LuTriangleAlert } from '../components/Icons';
import { nameRegex, mobileRegex, secretRegex } from '../utils/regex';

import '../styles/AuthForm.css';

export default class Signup extends Component {
  state = {
    name: '',
    mobile: '',
    secret: '',
    verify: '',
    showSecret: false,
    errors: [false, false, false, false],
    loading: false
  }

  onInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const errors = [...this.state.errors];

    if (name === 'name') errors[0] = !nameRegex.test(value);
    else if (name === 'mobile') errors[1] = !mobileRegex.test(value);
    else if (name === 'secret') errors[2] = !secretRegex.test(value);
    else if (name === 'verify') errors[3] = value !== this.state.secret;

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
        <form onSubmit={(e) => e.preventDefault()} onInput={this.onInput}>
          <div className="input-info">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={this.state.name}
              onInput={this.onInput}
              required
            />
            {this.state.errors[0] && <LuTriangleAlert />}
          </div>

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
            {this.state.errors[1] && <LuTriangleAlert />}
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
            >
              {this.state.showSecret ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
            {this.state.errors[2] && <LuTriangleAlert />}
          </div>

          <div className="input-secret verify">
            <label htmlFor="verify">Verify</label>
            <input
              name="verify"
              type={this.state.showSecret ? 'text' : 'password'}
              placeholder="$tr0nGs3cr3t"
              value={this.state.verify}
              onInput={this.onInput}
              required
            />
            <button
              type="button"
              onClick={this.toggleMask}
              className="mask-btn"
            >
              {this.state.showSecret ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
            {this.state.errors[3] && <LuTriangleAlert />}
          </div>

          <small class="cta">Have an account? <Link to="#">Login</Link></small>

          <div className="btn-submit">
            <button type="submit">Signup</button>
          </div>
        </form>
      </div>
      </div>
    );
  }
}