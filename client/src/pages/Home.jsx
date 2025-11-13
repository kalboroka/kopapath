import { Link } from 'inferno-router';
import LoMain from '../layouts/LoMain';
import { LuCircleQuestionMark, LuHandCoins, /*LuInfo*/ } from '../components/Icons';
import '../styles/Home.css'

const guideInfo = [
  [1, 'Check Loan Offers', 'See what you qualify for. Borrowable up to KES 25,000 with interest from 15%–25%, depending on repay terms.'],
  [2, 'Apply & Get Cash', 'Pick your amount and confirm — funds are sent to your M-Pesa in minutes.'],
  [3, 'Repay Easily', 'Repay within 30 days through M-Pesa. Flexible, transparent, and no hidden fees.']
]
const greeting = () => {
  const hrs = new Date().getHours();

  return (
    hrs >= 5 && hrs < 12 ? "Good Morning" :
      hrs >= 12 && hrs < 17 ? "Good Afternoon" :
        hrs >= 17 && hrs < 21 ? "Good Evening" :
          "Good Night"
  );
}

export default (props) => (
  <LoMain {...props}>
    <div class="home">
      <h4 class="greeting">{greeting()}, {props.state.user.name.split(' ')[0]}!</h4>

      <div class="cta">
        <h3>Get Fast & Reliable Credit</h3>
        <button><Link to='/loans/apply'>APPLY NOW</Link></button>
      </div>

      <div class="actions">
        <Link to='/loans/repay'><LuHandCoins /><span class='text'>Repay</span></Link>
        <Link to='/fqas'><LuCircleQuestionMark /><span class='text'>FQAs</span></Link>
      </div>

      <div class="guide">
        <h4>How it works</h4>
        <div class="guide-info">
          <ul>
            {guideInfo.map(([key, title, info]) => (
              <li key={key}>
                <span>{key}</span>
                <div class="card-info">
                  <h6>{title}</h6>
                  <p>{info}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div class="cta-2">
        <h4>Ready For Fair Deals?</h4>
        <button><Link to='/loans/apply'>LET&#39;S GO</Link></button>
      </div>
    </div>
  </LoMain>
);