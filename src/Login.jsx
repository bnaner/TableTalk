import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use .then/.catch instead of async/await to fix babel error
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        console.log('Response:', data);
        navigate('/home');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Login failed');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goToRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div style={styles.app}>
      <div style={styles.loginContainer}>
        <div style={styles.welcomeText}>
          <h1 style={styles.welcomeHeading}>Welcome to</h1>
          <div style={styles.appName}>Table Talk</div>
        </div>

        <div style={styles.socialLogin}>
          <button style={styles.socialBtn}>
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/google.svg" 
              alt="Google" 
              style={styles.socialBtnImg} 
            />
            Login with Google
          </button>
          <button style={styles.socialBtn}>
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg" 
              alt="Facebook" 
              style={styles.socialBtnImg} 
            />
            Login with Facebook
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <form style={styles.loginForm} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.passwordField}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span 
                onClick={togglePasswordVisibility}
                style={styles.togglePassword}
              >
                {showPassword ? '🔒' : '🔓'}
              </span>
            </div>
          </div>
          
          <div style={styles.rememberForgot}>
            <div style={styles.rememberMe}>
              <input 
                type="checkbox" 
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="remember-me" style={styles.rememberText}>Remember me</label>
            </div>
            <a 
              href="#" 
              onClick={goToRegister} 
              style={styles.forgotPassword}
            >
              Forgot Password?
            </a>
          </div>
          
          <button type="submit" style={styles.loginBtn}>Login</button>
        </form>
        
        <div style={styles.registerLink}>
          Don't have an account? <a href="#" onClick={goToRegister} style={styles.registerAnchor}>Register</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  app: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  loginContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '800px',
    minHeight: '600px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: '30px',
    marginTop: '40px',
  },
  welcomeHeading: {
    fontWeight: 'normal',
    color: '#333',
    marginBottom: '10px',
  },
  appName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a237e',
  },
  socialLogin: {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '20px',
  },
  socialBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '15px',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  socialBtnImg: {
    marginRight: '10px',
    width: '20px',
    height: '20px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '300px',
    margin: '20px 0',
    position: 'relative',
  },
  dividerText: {
    padding: '0 10px',
    backgroundColor: 'white',
    color: '#757575',
    fontSize: '14px',
    zIndex: 1,
  },
  loginForm: {
    width: '100%',
    maxWidth: '300px',
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '12px',
    color: '#757575',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
    fontSize: '14px',
  },
  passwordField: {
    position: 'relative',
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#757575',
  },
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '14px',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '5px',
  },
  rememberText: {
    fontSize: '14px',
  },
  forgotPassword: {
    color: '#1a237e',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#1a237e',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  registerLink: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  registerAnchor: {
    color: '#1a237e',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Login;