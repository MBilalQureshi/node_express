import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv';


// load environment variables from a .env file into process.env
dotenv.config();

const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri)
.then(() => {console.log('Connected to MongoDB')})
.catch((err) => {console.log('Could not connect to MongoDB',err)});

export default mongoose;