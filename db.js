import mongoose from 'mongoose';

async function connect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('successfully connected to database!');
  } catch (e) {
    console.log(e);
  }
}

export default connect;
