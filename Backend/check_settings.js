import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Setting from './src/models/Setting.model.js';

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const settings = await Setting.findOne({ name: 'global' });
        console.log(JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
};

check();
