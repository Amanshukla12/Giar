

  const verifyBtn = document.getElementById('verify-btn');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const forgetLink = document.getElementById('forget-link');
  const loginBtn = document.getElementById('login-btn');

  
  loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    // Here you should call your login API
    if (email && pass) {
      alert('Login successful (mock)');
      window.location.href = "index.html";
    } else {
      alert('Please enter both email and password');
    }
  });

  // Show OTP button when forget password is clicked
  forgetLink.addEventListener('click', (e) => {
    e.preventDefault();
    sendOtpBtn.style.display = 'inline-block';
    loginBtn.style.display = 'none';
    document.getElementById('password').style.display = 'none';
  
  });
  

  // Send OTP
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('OTP sent to your email!');
        document.getElementById('otp-section').style.display = 'block';
      } else {
        alert('Failed to send OTP. Try again.');
      }
    });
  });

  // Verify OTP
  verifyBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    fetch('/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('OTP Verified Successfully!');
        document.getElementById("a1").style.display = "block";
        document.getElementById("a2").style.display = "block";
      } else {
        alert('Invalid OTP. Please try again.');
      }
    });
  });

  function aman() {
    const newPassword = document.getElementById("a1").value;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
  
    alert('Password successfully created');
    window.location.href = "index.html";
  }
  function vikram(){
    let v=document.getElementById("z");
        v.style.display="block";
        let c1=document.getElementById("c1");
    c1.style.display="none";
       let password=document.getElementById("password");
       password.style.display="none";
  }
  function forget(){
      const form = document.getElementById('otp-form');
      form.style.display="block";
  }

  