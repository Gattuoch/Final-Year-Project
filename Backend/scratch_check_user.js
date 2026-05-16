const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        const user = await User.findOne({ email: 'camper@gmail.com' }).select('+password +passwordHash');
        console.log('User found:', JSON.stringify(user, null, 2));
        mongoose.connection.close();
    } catch (e) {
        console.error(e);
    }
}

check();
