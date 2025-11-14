import LoMain from '../layouts/LoMain';

import '../styles/FQAs.css';

const data = [
  {
    category: "General",
    items: [
      {
        q: "What is Kopapath?",
        a: "Kopapath is a simple loan management platform that helps you apply, track, and repay loans quickly and securely."
      }
    ]
  },
  {
    category: "Loan Application",
    items: [
      {
        q: "How do I apply for a loan?",
        a: "Go to Loans → Apply, choose an offer, review the terms, and submit your request."
      },
      {
        q: "Why was my loan declined?",
        a: "Reasons include incomplete profile, low eligibility score, pending repayments, or system risk checks."
      }
    ]
  },
  {
    category: "Repayments",
    items: [
      {
        q: "How do I repay my loan?",
        a: "Open any active loan and tap Repay. Supported: M-Pesa STK, PayBill, bank transfers depending on provider."
      },
      {
        q: "What happens if I repay late?",
        a: "A late penalty applies after the overdue period and may reduce your future borrowing limit."
      }
    ]
  },
  {
    category: "Support",
    items: [
      {
        q: "How do I contact support?",
        a: "Call +254711-111-111 or email support@kopapath.com."
      }
    ]
  }
];

export default (props) => (
  <LoMain {...props}>
    <div className="faq-container">
      <h4>Frequently Asked Questions</h4>

      {data.map(section => (
        <div className="faq-section" key={section.category}>
          <h4>{section.category}</h4>

          {section.items.map((item, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">{item.q}</summary>
              <div className="faq-answer"><small>{item.a}</small></div>
            </details>
          ))}
        </div>
      ))}
    </div>
  </LoMain>
);
