import { Component } from 'inferno';
import { apiFetch, session } from '../utils';
import LoMain from '../layouts/LoMain';

import '../styles/Messages.css';

export function fmtDate(d) {
  const date = new Date(d);
  const diffH = (new Date() - date) / (1000 * 60 * 60);

  if (diffH < 24) return date.toLocaleTimeString('en-KE', { hour12: true});
  if (diffH < 48) return 'yesterday';
  return date.toISOString().slice(0, 10);
}

class Message extends Component {
  componentDidMount() {
    const { msgInfo: { id, ack_at } } = this.props;
    if (!ack_at) {
      apiFetch(`/api/v1/messages/${id}/ack`, {
        method: 'PATCH',
        bearer: session.get()
      }).catch(err => console.warn('Message ack failed:', err.message));
    }
  }

  render() {
    const { msgInfo: { msg, sent_at } } = this.props;

    return (
      <div className='msg-body'>
        <p className='msg-text'>{msg}</p>
        <time className='msg-time'>{fmtDate(sent_at)}</time>
      </div>
    );
  }
}

// Messages list component
export default class Messages extends Component {
  state = {
    msgList: [],
    loading: true,
    error: null
  };

  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    try {
      const { ok, data } = await apiFetch('/api/v1/messages', {
        bearer: session.get()
      });

      if (!ok) throw new Error(data.error || 'Failed to fetch messages');

      if (this._isMounted) {
        this.setState({ msgList: data, loading: false });
      }
    } catch (err) {
      if (this._isMounted) {
        this.setState({ error: err.message, loading: false });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { msgList, loading, error } = this.state;

    if (loading) return <LoMain {...this.props}>Loading messages...</LoMain>;
    if (error) return <LoMain {...this.props}><p className="alt">Error: {error}</p></LoMain>;

    return (
      <LoMain {...this.props}>
        <div className="msg-container">
          <h4 className="lead">Messages</h4>
          {msgList.length ? (
            <ul className="msg-list">
              {msgList.map(m => (
                <li key={m.id}>
                  <Message msgInfo={m} />
                </li>
              ))}
            </ul>
          ) : (
            <p className='alt'>Oops! No new messages</p>
          )}
        </div>
      </LoMain>
    );
  }
}