import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css'; // optional if you're adding styles separately
import './Signup.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSignupInfo((prev) => ({ ...prev, [name]: value }));
//   };

 const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError('Name, email, and password are required');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/signup`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupInfo)
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate('/login'), 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || 'Signup failed';
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError('An error occurred. Please try again.');
    }
  };

//   return (
//     <div className="Login-container">
//       <form className="auth-form" onSubmit={handleSignup}>
//         <h2 className="auth-title">Create an Account</h2>

//         <div className="form-group">
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Enter your name..."
//             value={signupInfo.name}
//             onChange={handleChange}
//             autoFocus
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email..."
//             value={signupInfo.email}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter your password..."
//             value={signupInfo.password}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>

//         <button type="submit" className="auth-button">Sign Up</button>

//         <p className="auth-footer">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </form>
//       <ToastContainer />
//     </div>
//   );


return (
    <div className="Login-Page">
      <div className="Login-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="login-input-field">
            <label htmlFor='name' className="login-input-heading">Full Name</label>
            <input type="text"  onChange={handleChange} name='name' autoFocus  value={signupInfo.name} placeholder="Enter your full name" required />
          </div>
          <div className="login-input-field">
            <label htmlFor='email' className="login-input-heading">Email</label>
            <input  onChange={handleChange} type="email" name='email' value={signupInfo.email} placeholder="Enter your email" required />
          </div>
          <div className="login-input-field password-field">
            <label  htmlFor='password' className="login-input-heading">Password</label>
            <div className="password-wrapper">
              <input
               onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                required
                 name='password'
                 value={signupInfo.password}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button className="Login-page-button" type="submit" onClick={handleSignup}>Create Account</button>
          <p className="signup-link">
            Already have an account?{' '}
            <Link to="/login" className="login-signup-blue">Login</Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );

}

export default Signup;
