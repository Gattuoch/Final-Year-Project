const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        const campCount = await mongoose.connection.db.collection('camps').countDocuments();
        const campHomeCount = await mongoose.connection.db.collection('camphomes').countDocuments();
        
        console.log('camps count:', campCount);
        console.log('camphomes count:', campHomeCount);
        
        mongoose.connection.close();
    } catch (e) {
        console.error(e);
    }
}

check();
