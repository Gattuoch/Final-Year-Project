import mongoose from 'mongoose';
import User from './BackEnd/src/models/User.model.js';

const mongoURI = 'mongodb://localhost:27017/final-year-project';

async function checkUsers() {
    try {
        await mongoose.connect(mongoURI);
        const active = await User.countDocuments({ isActive: true, isBanned: false });
        const allUsers = await User.find({}, 'role isActive isBanned');
        
        console.log('Active Users Count (Dashboard Logic):', active);
        console.log('Total Users in DB:', allUsers.length);
        
        const roles = {};
        allUsers.forEach(u => {
            roles[u.role] = (roles[u.role] || 0) + 1;
        });
        
        console.log('Users by Role:', roles);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
