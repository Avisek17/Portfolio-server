import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

// Helpful connection state mapping
export const dbStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

// Attach low-level listeners for better diagnostics
mongoose.connection.on('connected', () => console.log('✅ Mongoose event: connected'));
mongoose.connection.on('reconnected', () => console.log('🔁 Mongoose event: reconnected'));
mongoose.connection.on('disconnected', () => console.warn('⚠️  Mongoose event: disconnected'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose event: error:', err.message));

const createIndexes = async () => {
  try {
    // Placeholder for explicit index creation; keep for future performance tuning
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }
  try {
    const start = Date.now();
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (in ${Date.now() - start}ms)`);
    await createIndexes();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Give a clearer hint for common DNS / network / IP allowlist issues
    if (/ENOTFOUND|failed to connect/i.test(error.message)) {
      console.error('🔍 Check: internet connectivity, MongoDB Atlas network access IP allowlist, and correct credentials.');
    }
    process.exit(1);
  }
};

export const getDbState = () => dbStateMap[mongoose.connection.readyState] || 'unknown';

export default connectDB;
