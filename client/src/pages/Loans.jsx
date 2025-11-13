// client/src/pages/Loans.jsx
import { Component } from 'inferno';
import { Switch, Link } from 'inferno-router';
import GuardRoute from '../components/GuardRoute';
import LoMain from '../layouts/LoMain';
import { LuAsterisk, LuTriangleAlert } from '../components/Icons';
import FormField from '../components/FormField';
import { apiFetch } from '../utils/api';
import { session } from '../utils/session';

import '../styles/Loans.css';

// --------------------
// Pages
// --------------------
const LoanIndex = ({ local, ...props }) => {
  const { loans, loading } = local;
  if (loading) return <LoMain {...props} ><div className="loader"><h4>Loading...</h4></div></LoMain>;

  return (
    <LoMain {...props} >
      <div className="loan-summary">
        <div className="lead">
          <h4>Loan Summary</h4>
          <div className='actions'>
            <Link to={`${props.match.url}/apply`}>Apply</Link>
            <Link to={`${props.match.url}/repay`}>Repay</Link>
          </div>
        </div>
        <div className="info">
          {loans.length ? (
            <table>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Amount</th>
                  <th>Term</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(({ ref, amount, term, status }) => (
                  <tr key={ref}>
                    <td>{ref}</td>
                    <td>{amount}</td>
                    <td>{term}</td>
                    <td>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No past loans!</p>
          )}
        </div>
      </div>
    </LoMain>
  );
};

const formatter = x => (new Intl.NumberFormat('en-KE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})).format(x);

const strCapitalize = (str) => (
  (typeof str !== 'string' || str.length === 0) ? str :
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
);

class LoanApply extends Component {
  state = {
    fields: [
      { name: 'amount', value: null, error: null },
      { name: 'term', value: null, error: null }
    ],
    maxOffer: 0,
    loading: true,
  };

  calculator = () => {
    const { fields: [{ value: amount }, { value: term }] } = this.state;
    const rate = (
      term > 21 ? 0.35 :
        term > 14 ? 0.3 :
          term > 7 ? 0.25 : 0.2
    );
    return (1 + rate) * amount
  }

  validateField(name, value) {
    const maxOffer = this.state.maxOffer;
    if (name === 'amount') return value >= 150 && value <= maxOffer ? '' : 'amount out of range';
    if (name === 'term') return value >= 1 && value <= 30 ? '' : 'term not within 30 days';
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

  async componentDidMount() {
    try {
      const { ok, data } = await apiFetch('/api/v1/loans/offers', { bearer: session.get() });
      if (!ok) throw new Error(data.error);
      this.setState({ maxOffer: data.max_offer, loading: false });
    } catch (err) {
      this.props.dispatch({
        type: 'setModal',
        value: {
          on: true,
          msg: err.message,
          icon: <LuTriangleAlert size={24} color='orangered' />
        }
      });
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, maxOffer, fields } = this.state;
    const { match } = this.props;

    if (loading) return <LoMain {...this.props} ><div className="loader"><h4>Loading...</h4></div></LoMain>;

    return (
      <LoMain {...this.props} >
        <div className="loan-apply">
          <h4 className="lead">Loan Application</h4>
          <div className="info">
            {maxOffer >= 150 ? (<>
              <h5 style={{ color: 'teal' }}>Available for you:</h5>
              <div className="loan-offers">
                <span style={{ '--idx': 3 }}>KES<br />150</span>
                {maxOffer > 150 && <>
                  <small>UP TO</small>
                  <span style={{ '--idx': 5 }}>KES<br />{formatter(maxOffer)}</span>
                </>
                }
              </div>
              <div class="loan-form">
                <div class="form-wrapper">
                  <h4>Loan Form:</h4>
                  <form onSubmit={() => { }}>
                    {fields.map(f => <FormField
                      label={strCapitalize(f.name)}
                      name={f.name}
                      type='number'
                      placeholder={`Loan ${strCapitalize(f.name)}`}
                      value={f.value}
                      onInput={this.onInput}
                      error={f.error}
                    />
                    )}
                    <div class="due" style={{margin: '1rem 0', color: 'darkslateblue'}}>
                      <h5>Total Due: KES {formatter(this.calculator()) }</h5>
                    </div>
                    <div className="btn-submit">
                      <button type="submit" disabled={this.state.loading}>
                        Apply
                      </button>
                    </div>
                  </form>
                  <div class="reminder">
                  <small><p style={{color: 'orangered', 'font-style': 'italic'}}><strong>Reminder:</strong> <span style={{'font-size': '0.75rem'}}>Please settle your loan on time. Payments delayed beyond <strong>7 days</strong> will attract a <strong>5% additional interest charge</strong>.</span></p></small>
                  </div>
                </div>
              </div>
            </>
            ) : (
              <p className='alt'>No offers available!</p>
            )}
          </div>
        </div>
      </LoMain>
    );
  }
}

const LoanRepay = (props) => (
  <LoMain {...props} >
    <div className="loan-repay">
      <h4 className="lead">Loan Repayment</h4>
      <div className="info">
        <div className='info-repay'>
          <p>
            Repay your loan easily using <strong>M-Pesa</strong>. Timely repayment improves your credit limit.
          </p>
          <ol>
            <li><LuAsterisk /> <span>Go to <strong>Lipa na M-Pesa</strong> → <strong>Paybill</strong>.</span></li>
            <li><LuAsterisk /> <span>Paybill: <strong>010101</strong>.</span></li>
            <li><LuAsterisk /> <span>Account: Linked <strong>Mobile Number</strong>.</span></li>
            <li><LuAsterisk /> <span>Enter <strong>amount</strong> and confirm.</span></li>
          </ol>

          <p>
            Payment reflects automatically within minutes. If not, <Link to='/about'>Contact Support Team</Link>.
          </p>
        </div>
      </div>
    </div>
  </LoMain>
);

// --------------------
// Main Loans component
// --------------------
export default class Loans extends Component {
  state = {
    loans: [],
    loading: true,
  };

  async componentDidMount() {
    try {
      const { ok, data } = await apiFetch('/api/v1/loans/offers', { bearer: session.get() });
      if (!ok) throw new Error(data.error);
      this.setState({ loans: data, loading: false });
    } catch (err) {
      this.props.dispatch({
        type: 'setModal',
        value: {
          on: true,
          msg: err.message,
          icon: <LuTriangleAlert size={24} color='orangered' />
        }
      });
      this.setState({ loading: false });
    }
  }

  render() {
    const { match } = this.props;

    return (
      <Switch>
        <GuardRoute
          exact
          path={match.path}
          render={(rtProps) => <LoanIndex {...this.props} {...rtProps} local={this.state} />}
        />
        <GuardRoute
          path={`${match.path}/apply`}
          render={(rtProps) => <LoanApply {...this.props} {...rtProps} />}
        />
        <GuardRoute
          path={`${match.path}/repay`}
          render={(rtProps) => <LoanRepay {...this.props} {...rtProps} />}
        />
      </Switch>
    );
  }
}