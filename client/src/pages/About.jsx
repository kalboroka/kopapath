import LoMain from '../layouts/LoMain';
import { LuMail, LuPhone } from '../components/Icons';

import '../styles/About.css';

export default (p) => (
  <LoMain {...p}>
    <div className="about-container">
      <h4>About Us</h4>
      <div className="info">
        <p><strong>KopaPath</strong> is a simple and reliable platform that helps you access short-term credit when you need it most.</p>
        <p>Our goal is to make borrowing <em>transparent, fast, and stress-free.</em>
          We use clear terms, fair rates, and a quick approval process so you can cover your day-to-day needs without jumping through hoops.</p>
        <p><strong>KopaPath</strong> is built in Kenya for Kenyans—secure, compliant, and always improving to serve you better.</p>
        <p className="contact">
          <h4>For help or questions:</h4>
          <a href="mailto:support@kopapath.com"><LuMail size={16}/> <span className='text'>support@kopapath.com</span></a>
          <a href="tel:+254711111111"><LuPhone size={16}/><span>+254 711 111 111</span></a>
        </p>
      </div>
    </div>
  </LoMain>
);
