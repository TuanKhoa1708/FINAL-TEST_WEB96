const mongoose = require('mongoose');


const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const { host, port, name } = connection.connection;
    console.log(`✅ MongoDB connected successfully`);
    console.log(`   Host     : ${host}`);
    console.log(`   Database : ${name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
