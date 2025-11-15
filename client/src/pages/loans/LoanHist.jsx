import { Component } from 'inferno';
import { Link } from 'inferno-router';
import LoMain from '../../layouts/LoMain';
import { LuTriangleAlert } from '../../components/Icons';
import { apiFetch, session } from '../../utils';

const fmt = x => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(x);

export default class LoanHist extends Component {
  state = { loans: [], loading: true };

  async componentDidMount() {
    try {
      const { ok, data } = await apiFetch('/api/v1/loans', { bearer: session.get() });
      if (!ok) throw new Error(data.error);
      this.setState({ loans: data, loading: false });
    } catch (err) {
      this.props.dispatch({
        type: 'setModal',
        value: { on: true, msg: err.message, icon: <LuTriangleAlert size={32} color="orangered" /> }
      });
      this.setState({ loading: false });
    }
  }

  render() {
    const { loans, loading } = this.state;
    if (loading) return <LoMain {...this.props}><div class="loader"><h4>Loading...</h4></div></LoMain>;
    return (
      <LoMain {...this.props}>
        <div class="loan-summary">
          <div class="lead">
            <h4>Loans Summary</h4>
            <div class="actions">
              <Link to={`${this.props.match.url}/apply`}>Apply</Link>
              <Link to={`${this.props.match.url}/repay`}>Repay</Link>
            </div>
          </div>
          <div class="info">
            {loans.length ? (<>
              <h5>Your recent loans:</h5>
              <table>
                <thead><tr><th>Ref</th><th>Amount</th><th>Term</th><th>TotalDue</th><th>Status</th></tr></thead>
                <tbody>{loans.map(l =>
                  <tr key={l.id}><td>{l.id}</td><td>{fmt(l.amount)}</td><td>{l.term}</td><td>{l.total_due}</td><td>{l.status}</td></tr>
                )}</tbody>
              </table>
            </>
            ) : <p>Oops! No past loans!</p>}
          </div>
        </div>
      </LoMain>
    );
  }
};