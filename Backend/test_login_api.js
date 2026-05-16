const axios = require('axios');

async function testLoginApi() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            identifier: 'systemadmin@ethiocamp.et',
            password: 'SuperSecurePassword123!'
        });
        console.log('Login API Success!');
        console.log('Response Status:', response.status);
        console.log('Token Received:', !!response.data.data?.token || !!response.data.token);
    } catch (error) {
        console.error('Login API Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testLoginApi();
