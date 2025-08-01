import React, { useEffect, useState } from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import LoginButton from '../components/LoginButton';
import { useCart } from "../Context/CartContext";

const Homepage = () => {
  const { cart } = useCart();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
    useEffect(() => {
    AOS.init({ duration: 1000 }); // Optional: animation duration
  }, []);
  useEffect(() => {
  const handleScroll = () => {
    const btn = document.getElementById('scrollTopBtn');
    if (window.scrollY > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  const handleStartDesigning = () => {
    navigate('/Dashboard');
  };
  const handleARMeasurement = () => {
    navigate('/ARMeasurementTool');
  };
  const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  useEffect(() => {
    // Get username from localStorage if logged in
    const name = localStorage.getItem('loggedInUser');
    if (name) setUsername(name);
  }, []);

  return (
    <div className="Homepage">
      
      <header>
        <div className="Homepage-login-button">
          <LoginButton />
        </div>
        <h1>
          <i className="fas fa-cube"></i> AR <span>House</span> Design
        </h1>
        {/* Show username if logged in */}
        {/* {username && (
          <div style={{ textAlign: 'right', color: '#f6b131', fontSize: '20px', marginRight: '30px' }}>
            Welcome, {username}!
          </div>
        )} */}
  {/* <nav>
    <ul>
      <li className="navigation">Platform</li>
      <li className="navigation">3D Viewer</li>
      <li className="navigation">Contact Us</li>
    </ul>
  </nav> */}
  
  <div className="H-typewriter">Welcome to Your Smart AR Home Designer</div>
  <div className="H-container">
    <div className="H-text">
      <h2>Home Designing Software</h2>
      <p>
        Struggling to design your dream home? Let's make it easy! From creating floor plans to furnishing and selecting materials, you can design a cozy, perfect space online. Whether it's a cottage or family home, everything you need is just a few clicks away!
      </p>
      <div className="H-cta">
        <p>Ready to Build Your Dream Home?</p>
        <button onClick= {handleStartDesigning}>Start Designing Now</button>
        
        <button onClick= {handleARMeasurement}>AR Measurement Tool</button>
      </div>
    </div>
    <img
      src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzhvOGJpanZyaHZ0b2dzMDRlMHhtZndkb2Q2eHFqZTYzNzJoeXg1OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYB5VID82DukVy0/giphy.gif"
      alt="home image"
    />
  </div>
  <br />
  <br />
  <br />
  <br />
  <div className="H-dots">
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>
  <br />
  <br />
  <div className="H-section" data-aos="fade-up">
    <span className="H-heading">Why Choose AR Home Design?</span>
    <ul className="H-features">
      <li>
        <i className="fas fa-vr-cardboard" /> View your dream home in real-time
        with AR
      </li>
      <li>
        <i className="fas fa-ruler-combined" /> Accurate room and furniture
        scaling
      </li>
      <li>
        <i className="fas fa-tools" /> Test materials and textures instantly
      </li>
      <li>
        <i className="fas fa-thumbs-up" /> Make confident decisions before
        building
      </li>
    </ul>
  </div>
  <div className="H-section H-section-split" data-aos="fade-up">
    <div className="H-text-col">
      <span className="H-heading">Visualize Before You Build</span>
      <p>
        Say goodbye to 2D floor plans. With our AR tool, you can walk through
        your future home, test layouts, materials, and lighting—all from your
        phone or tablet.
      </p>
    </div>
    <img
      src="https://plus.unsplash.com/premium_photo-1661883982941-50af7720a6ff?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8M2QlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D"
      alt="AR walkthrough"
    />
  </div>
  <div className="H-section-cards">
    <div className="H-card">
      <h3>Instant AR View</h3>
      <p>Preview your design instantly in your actual space.</p>
    </div>
    <div className="H-card">
      <h3>No Technical Skills</h3>
      <p>Built for everyone, from beginners to architects.</p>
    </div>
    <div className="H-card">
      <h3>Real-Time Collaboration</h3>
      <p>Share designs live with clients or family.</p>
    </div>
    <div className="H-card">
      <h3>Custom Layouts</h3>
      <p>
        Resize rooms, add walls, and change furniture placements on the fly.
      </p>
    </div>
  </div>
  <div className="H-section" data-aos="fade-up" data-aos-delay={100}>
    <span className="H-heading">Built for Everyone </span>
    <br />
    <br />
    <p className="H-content">
      Whether you're a first-time homeowner, an architect, an interior designer,
      or simply someone with a vision, our AR home design platform is made for
      you. No complex tools or technical skills required—just open your camera,
      place your design, and explore your space. Easily customize layouts,
      materials, and furniture to match your style and needs. Share your ideas
      with family, clients, or builders.
    </p>
    <br />
    <br />
  </div>
  <div className="H-section" data-aos="fade-up" data-aos-delay={100}>
    {" "}
    <span className="H-heading">Start Designing Today</span>
    <br />
    <br />
    <p className="H-content">
      Your dream home is just a few taps away. With our AR-powered platform, you
      don’t need to wait for blueprints or months of planning to see your ideas
      come to life. Start designing instantly—choose a layout, place it in your
      space, and explore it from every angle. Make real-time changes, try out
      different materials, and experience how it all comes together.{" "}
    </p>
    <br />
    <br />
  </div>
  {/* <div>
      <h3>Your Cart:</h3>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>
            Product: {item.productId} | Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div> */}
  <button onClick={scrollToTop} id="scrollTopBtn" title="Go to top">↑</button>

</header>

    </div>
  );
};

export default Homepage;
