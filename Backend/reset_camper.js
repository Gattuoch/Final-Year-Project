const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');

async function reset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'camper@gmail.com' });
        if (user) {
            user.password = 'camper123456';
            user.isVerified = true; // Also verify it for testing
            await user.save();
            console.log('Password reset to: camper123456');
        } else {
            console.log('User not found');
        }
        mongoose.connection.close();
    } catch (e) {
        console.error(e);
    }
}

reset();
