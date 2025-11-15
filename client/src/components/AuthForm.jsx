import { Component } from 'inferno';
import { Link } from 'inferno-router';
import FormField from './FormField';
import SecretField from './SecretField';
import Modal from './Modal';
import { LuCircleAlert, LuInfo } from './Icons';
import { apiFetch, regex, session } from '../utils';

import '../styles/AuthForm.css';

export default class AuthForm extends Component {
  constructor(props) {
    super(props);
    const { mode } = this.props;
    this.state = {
      fields: this.initFields(mode),
      showSecret: false,
      loading: false
    };
  }

  initFields(mode) {
    const used = mode === 'signup' ? ['name', 'mobile', 'email', 'secret', 'verify'] : ['userid', 'secret'];
    return used.map(name => ({ name, value: '', error: '' }));
  }

  validateField(name, value) {
    if (name === 'name') return regex.name.test(value) ? '' : 'invalid name';
    if (name === 'userid') return (regex.mobile.test(value) || regex.email.test(value)) ? '' : 'invalid userid';
    if (name === 'mobile') return regex.mobile.test(value) ? '' : 'invalid mobile';
    if (name === 'email') return regex.email.test(value) ? '' : 'invalid email';
    if (name === 'secret') return regex.secret.test(value) ? '' : 'invalid secret';
    if (name === 'verify') {
      const secret = this.state.fields.find(f => f.name === 'secret')?.value;
      return value === secret ? '' : 'secrets mismatched';
    }
    return '';
  }

  showModal(msg, color = 'orangered', Icon = LuCircleAlert) {
    this.props.dispatch({
      type: 'setModal',
      value: { on: true, msg, icon: <Icon size={32} color={color} /> }
    });
  }

  onInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const fields = this.state.fields.map(f =>
      f.name === name ? { ...f, value, error: this.validateField(name, value) } : f
    );
    this.setState({ fields });
  };

  toggleMask = () => this.setState({ showSecret: !this.state.showSecret });

  onSubmit = async (e) => {
    e.preventDefault();

    // Start loading
    this.setState({ loading: true });

    const invalid = this.state.fields.find(f => f.error);
    if (invalid) {
      this.setState({ loading: false })
      this.showModal(invalid.error)
      return;
    }

    const body = {};
    this.state.fields.forEach(f => {
      if (f.name !== 'verify') body[f.name] = f.value;
    });

    const { ok, data } = await apiFetch(
      `/api/v1/auth/${this.props.mode}`,
      { method: 'POST', body }
    );
    this.setState({ loading: false });

    if (ok) {
      session.set(data.accessToken);
      if (this.props.mode === 'signup') {
        this.showModal('Account created! Please login', 'teal', LuInfo);
        this.props.history.push('/auth/login');
      } else {
        session.set(data.user, 'User');
        this.props.history.push('/');
      }
    } else {
      this.showModal(data.error)
    }
  };

  render() {
    const { mode } = this.props;
    const isSignup = mode === 'signup';

    return (
      <div className="form-container">
        <div className="form-wrapper">
          <div className="logo">
            <h1 className="title">KopaPath</h1>
            <small className="slogan">Future is now!</small>
          </div>

          <form onSubmit={this.onSubmit}>
            {this.state.fields.map(f => {
              if (f.name === 'secret' || f.name === 'verify') {
                return (
                  <SecretField
                    key={f.name}
                    label={f.name === 'verify' ? 'Verify' : 'Secret'}
                    name={f.name}
                    value={f.value}
                    placeholder={f.name === 'verify' ? 're-enter secret' : 'enter secret'}
                    show={this.state.showSecret}
                    onToggle={this.toggleMask}
                    onInput={this.onInput}
                    error={f.error}
                  />
                );
              }
              return (
                <FormField
                  key={f.name}
                  label={f.name === 'mobile' ? 'Mobile' : f.name === 'name' ? 'Name' : isSignup ? 'Email' : 'UserId'}
                  name={f.name}
                  type={f.name === 'mobile' ? 'tel' : f.name === 'email' ? 'email' : 'text'}
                  placeholder={f.name === 'mobile' ? '254X-XX-XXX-XXX' : f.name === 'name' ? 'Full Name' : isSignup ? 'user@org.com' : 'email or mobile'}
                  value={f.value}
                  onInput={this.onInput}
                  error={f.error}
                />
              );
            })}

            <small className="cta">
              {isSignup ? (
                <>Have an account? <Link to="/auth/login">Login</Link></>
              ) : (
                <>New here? <Link to="/auth/signup">Signup</Link> now</>
              )}
            </small>

            <div className="btn-submit">
              <button type="submit" disabled={this.state.loading}>
                {isSignup ? 'Signup' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        <Modal
          on={this.props.state.modal.on}
          msg={this.props.state.modal.msg}
          icon={this.props.state.modal.icon}
          close={() => this.props.dispatch({ type: 'setModal', value: { on: false } })}
        />
      </div>
    );
  }
}