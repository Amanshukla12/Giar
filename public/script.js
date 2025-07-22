// LOGIN FUNCTIONALITY
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Login successful');
       localStorage.setItem('loggedInEmail', 'aman0567shukla@gmail.com')
        window.location.href = 'index.html'; // ✅ Redirect after login
      } else {
        alert(data.message || 'Login failed');
      }
    });
  });
}

// OTP FLOW FOR REGISTRATION / FORGOT PASSWORD
const otpForm = document.getElementById('otp-form');
const verifyBtn = document.getElementById('verify-btn');
const setPasswordBtn = document.getElementById('set-password-btn');

if (otpForm) {
  // Step 1: Send OTP
  otpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('OTP sent to your email');
        document.getElementById('otp-section').style.display = 'block';
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    });
  });

  // Step 2: Verify OTP
  verifyBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    fetch('/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('OTP verified successfully');
        document.getElementById('new-password-section').style.display = 'block';
      } else {
        alert('Invalid OTP');
      }
    });
  });

  // Step 3: Register or Reset Password
  setPasswordBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('new-password').value;

    // Determine context: register or forgot password
    const isRegister = window.location.pathname.includes('register.html');

    fetch(isRegister ? '/register' : '/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(isRegister ? 'Registration successful!' : 'Password updated!');
        window.location.href = 'login.html'; // ✅ Redirect after registration or reset
      } else {
        alert(data.message || 'Failed to save password');
      }
    });
  });
}
