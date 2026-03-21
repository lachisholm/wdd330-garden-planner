// sign-in-demo-jwt.js
// Simulate JWT authentication for frontend-only demo

document.getElementById('sign-in-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('sign-in-message');

  // Demo: require a specific password
  const DEMO_PASSWORD = 'password123';

  if (!email || !password) {
    messageDiv.style.color = '#c0392b';
    messageDiv.textContent = 'Please enter both email and password.';
    return;
  }

  if (password !== DEMO_PASSWORD) {
    messageDiv.style.color = '#c0392b';
    messageDiv.textContent = 'Incorrect password. Try "password123".';
    return;
  }

  // Simulate a JWT (header.payload.signature)
  const fakeJWT = [
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    btoa(JSON.stringify({ sub: email, name: email.split('@')[0], iat: Date.now() / 1000 })),
    'signature12345'
  ].join('.');
  // Store JWT in localStorage
  localStorage.setItem('jwt', fakeJWT);
  messageDiv.style.color = '#27ae60';
  messageDiv.textContent = 'Sign in successful! JWT stored in localStorage.';
});

// Example: How to use the JWT in a fetch request
// const jwt = localStorage.getItem('jwt');
// fetch('/api/protected', { headers: { 'Authorization': 'Bearer ' + jwt } });
