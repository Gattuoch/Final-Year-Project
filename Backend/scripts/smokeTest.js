import axios from 'axios';

(async () => {
  try {
    const base = 'http://localhost:5000/api/auth';

    console.log('Registering test user...');
    const reg = await axios.post(`${base}/register`, {
      fullName: 'Smoke Test',
      email: 'smoke+1@example.com',
      phone: '0912345678',
      password: 'P@ssw0rd123',
      role: 'camper',
    }, { timeout: 10000 });
    console.log('Register response:', reg.status, reg.data);

    console.log('Logging in test user...');
    const login = await axios.post(`${base}/login`, {
      identifier: 'smoke+1@example.com',
      password: 'P@ssw0rd123',
    }, { timeout: 10000 });
    console.log('Login response:', login.status, login.data);

    console.log('Smoke test completed successfully.');
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('HTTP error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message || err);
    }
    process.exit(1);
  }
})();
