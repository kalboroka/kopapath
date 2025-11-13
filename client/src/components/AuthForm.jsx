import { Component } from 'inferno';
import { Link } from 'inferno-router';

import FormField from './FormField';
import SecretField from './SecretField';
import Modal from './Modal';

import { LuTriangleAlert, LuInfo } from './Icons';

import { nameRegex, mobileRegex, secretRegex } from '../utils/regex';
import { apiFetch } from '../utils/api';
import { session } from '../utils/session';
import { toggleModal } from '../utils/helpers';

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
    const used = mode === 'signup' ? ['name', 'mobile', 'secret', 'verify'] : ['mobile', 'secret'];
    return used.map(name => ({ name, value: '', error: '' }));
  }

  validateField(name, value) {
    if (name === 'name') return nameRegex.test(value) ? '' : 'invalid name';
    if (name === 'mobile') return mobileRegex.test(value) ? '' : 'invalid mobile';
    if (name === 'secret') return secretRegex.test(value) ? '' : 'invalid secret';
    if (name === 'verify') {
      const secret = this.state.fields.find(f => f.name === 'secret')?.value;
      return value === secret ? '' : 'secrets mismatched';
    }
    return '';
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
      this.props.dispatch({
        type: 'setModal',
        value: {
          on: true,
          msg: invalid.error,
          icon: <LuTriangleAlert size={24} color='orangered' />
        }
      });
      return;
    }

    const body = {};
    this.state.fields.forEach(f => {
      if (f.name !== 'verify') body[f.name] = f.value;
    });

    const { ok, data } = await apiFetch(
      `/api/v1/auth/${this.props.mode}`,
      {
        method: 'POST',
        body
      });
    this.setState({ loading: false });

    if (ok) {
      session.set(data.accessToken);
      if (this.props.mode === 'signup') {
        this.props.dispatch({
          type: 'setModal',
          value: {
            on: true,
            msg: 'Account created! Please login',
            icon: <LuInfo size={24} color='teal' />
          }
        });
        this.props.history.push('/auth/login');
      } else {
        window.sessionStorage.setItem('User', JSON.stringify(data.user));
        this.props.history.replace('/');
      }
    } else {
      this.props.dispatch({
        type: 'setModal',
        value: {
          on: true,
          msg: data.error,
          icon: <LuTriangleAlert size={24} color='orangered' />
        }
      });
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
            <small className="slogan">Future is now</small>
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
                    placeholder={f.name === 'verify' ? 're-enter secret' : 'StronG$ecr3t'}
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
                  label={f.name === 'mobile' ? 'Mobile' : 'Name'}
                  name={f.name}
                  type={f.name === 'mobile' ? 'tel' : 'text'}
                  placeholder={f.name === 'mobile' ? '254X-XX-XXX-XXX' : 'Full Name'}
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
          toggle={() => toggleModal(this.props.state.modal, this.props.dispatch)}
        />
      </div>
    );
  }
}